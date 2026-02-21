import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, QrCode, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Packing, PackingItem, mockPackings } from '@/data/mockTransactions';
import { mockProducts, mockGrades, mockUnits } from '@/data/mockData';
import QRCode from 'qrcode';

async function printLabel(packing: Packing) {
  const labels = packing.items.flatMap((item) => {
    return Array.from({ length: item.quantity }, (_, i) => ({
      productName: item.productName,
      gradeName: item.gradeName,
      unitName: item.unitName,
      lotNo: packing.lotNo,
      packDate: packing.date,
      sourceSupplier: packing.sourceSupplier,
      sourceDate: packing.sourceDate,
      boxNo: i + 1,
      totalBoxes: item.quantity,
      docNo: packing.docNo,
    }));
  });

  // Generate QR codes as data URLs
  const qrImages = await Promise.all(
    labels.map((l) => {
      const qrData = JSON.stringify({
        lot: l.lotNo,
        box: l.boxNo,
        product: l.productName,
        grade: l.gradeName,
        date: l.packDate,
        source: l.sourceSupplier,
      });
      return QRCode.toDataURL(qrData, { width: 120, margin: 1 });
    })
  );

  const labelHtml = labels.map((l, idx) => `
    <div class="label" ${idx > 0 && idx % 4 === 0 ? 'style="page-break-before:always;"' : ''}>
      <div class="label-header">
        <div class="brand">🍈 ล้งทุเรียน</div>
        <div class="product-name">${l.productName}</div>
      </div>
      <div class="label-body">
        <div class="grade-badge">${l.gradeName}</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="lbl">Lot No.</span>
            <span class="val">${l.lotNo}</span>
          </div>
          <div class="info-item">
            <span class="lbl">กล่อง</span>
            <span class="val">${l.boxNo} / ${l.totalBoxes}</span>
          </div>
          <div class="info-item">
            <span class="lbl">วันที่แพ็ค</span>
            <span class="val">${l.packDate}</span>
          </div>
          <div class="info-item">
            <span class="lbl">บรรจุภัณฑ์</span>
            <span class="val">${l.unitName}</span>
          </div>
          <div class="info-item full">
            <span class="lbl">แหล่งที่มา</span>
            <span class="val">${l.sourceSupplier} (${l.sourceDate})</span>
          </div>
        </div>
        <div class="qr-section">
          <img src="${qrImages[idx]}" class="qr-img" alt="QR" />
          <div class="qr-text">${l.lotNo}-${String(l.boxNo).padStart(3, '0')}</div>
        </div>
      </div>
      <div class="label-footer">
        <span>เอกสาร: ${l.docNo}</span>
        <span>GAP Certified 🇹🇭</span>
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>Label ${packing.docNo}</title>
<style>
  @media print {
    @page { size: A4; margin: 10mm; }
    body { margin: 0; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Tahoma', sans-serif; padding: 10px; }
  .labels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .label {
    border: 2px solid #222;
    border-radius: 8px;
    padding: 12px;
    width: 100%;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    break-inside: avoid;
  }
  .label-header {
    text-align: center;
    border-bottom: 2px solid #222;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  .brand { font-size: 14px; font-weight: bold; }
  .product-name { font-size: 18px; font-weight: bold; margin-top: 2px; }
  .label-body { flex: 1; }
  .grade-badge {
    display: inline-block;
    background: #222;
    color: #fff;
    padding: 2px 14px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    font-size: 11px;
    margin-bottom: 8px;
  }
  .info-item { display: flex; flex-direction: column; }
  .info-item.full { grid-column: 1 / -1; }
  .lbl { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  .val { font-size: 12px; font-weight: bold; }
  .qr-section { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .qr-img {
    width: 60px; height: 60px;
  }
  .qr-text { font-family: monospace; font-size: 10px; color: #555; }
  .label-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    padding-top: 6px;
    margin-top: 8px;
    font-size: 9px;
    color: #666;
  }
</style>
</head>
<body>
  <div class="labels-grid">
    ${labelHtml}
  </div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  }
}

export default function PackingPage() {
  const [data, setData] = useState<Packing[]>(mockPackings);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Packing>>({});
  const [editItems, setEditItems] = useState<PackingItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = data.filter((p) => [p.docNo, p.lotNo, p.sourceSupplier].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  const fmt = (n: number) => n.toLocaleString('th-TH');

  const openAdd = () => {
    setEditItem({ date: new Date().toISOString().split('T')[0], docNo: `PK-2568-${String(data.length + 1).padStart(4, '0')}`, lotNo: `LOT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(data.length + 1).padStart(3, '0')}`, yieldPercent: 0 });
    setEditItems([]);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const addItem = () => {
    setEditItems([...editItems, { productId: '', productName: '', gradeId: '', gradeName: '', quantity: 0, unitId: '', unitName: '', pricePerUnit: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: keyof PackingItem, value: any) => {
    const items = [...editItems];
    (items[idx] as any)[field] = value;
    if (field === 'productId') items[idx].productName = mockProducts.find((p) => p.id === value)?.name || '';
    if (field === 'gradeId') items[idx].gradeName = mockGrades.find((g) => g.id === value)?.name || '';
    if (field === 'unitId') items[idx].unitName = mockUnits.find((u) => u.id === value)?.name || '';
    items[idx].amount = items[idx].quantity * items[idx].pricePerUnit;
    setEditItems(items);
  };

  const handleSave = () => {
    const totalBoxes = editItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = editItems.reduce((s, i) => s + i.amount, 0);
    const packing: Packing = {
      id: isEditing ? editItem.id! : String(Date.now()),
      docNo: editItem.docNo || '', lotNo: editItem.lotNo || '', date: editItem.date || '',
      items: editItems, totalBoxes, totalAmount,
      yieldPercent: editItem.yieldPercent || 0,
      sourceSupplier: editItem.sourceSupplier || '', sourceDate: editItem.sourceDate || '',
      status: 'packing',
    };
    if (isEditing) setData(data.map((d) => (d.id === packing.id ? packing : d)));
    else setData([...data, packing]);
    toast.success('บันทึกเรียบร้อย');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold">แพ็คกิ้ง (Packing)</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> เพิ่ม</Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">#</TableHead>
              <TableHead className="text-xs">วันที่</TableHead>
              <TableHead className="text-xs">เลขที่</TableHead>
              <TableHead className="text-xs">Lot No.</TableHead>
              <TableHead className="text-xs">สวนต้นทาง</TableHead>
              <TableHead className="text-xs text-right">จำนวนกล่อง</TableHead>
              <TableHead className="text-xs text-right">Yield %</TableHead>
              <TableHead className="text-xs text-center">สถานะ</TableHead>
              <TableHead className="text-xs text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p, idx) => (
              <TableRow key={p.id} className="hover:bg-muted/30">
                <TableCell className="text-xs">{idx + 1}</TableCell>
                <TableCell className="text-sm">{p.date}</TableCell>
                <TableCell className="text-sm font-mono">{p.docNo}</TableCell>
                <TableCell className="text-sm font-mono">{p.lotNo}</TableCell>
                <TableCell className="text-sm">{p.sourceSupplier}</TableCell>
                <TableCell className="text-sm text-right">{p.totalBoxes}</TableCell>
                <TableCell className="text-sm text-right">
                  <span className={p.yieldPercent >= 70 ? 'text-success' : p.yieldPercent >= 65 ? 'text-warning' : 'text-destructive'}>
                    {p.yieldPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                    {p.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังแพ็ค'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => printLabel(p)} title="พิมพ์ Label สินค้า">
                      <Tag className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`QR: ${p.lotNo}`)}>
                      <QrCode className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-info" onClick={() => { setEditItem({ ...p }); setEditItems([...p.items]); setIsEditing(true); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setData(data.filter((d) => d.id !== p.id)); toast.success('ลบเรียบร้อย'); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}แพ็คกิ้ง</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormInput label="วันที่" type="date" value={editItem.date || ''} onChange={(v) => setEditItem({ ...editItem, date: v })} />
              <FormInput label="เลขที่" value={editItem.docNo || ''} onChange={(v) => setEditItem({ ...editItem, docNo: v })} />
              <FormInput label="Lot No." value={editItem.lotNo || ''} onChange={(v) => setEditItem({ ...editItem, lotNo: v })} />
              <FormInput label="Yield %" type="number" value={String(editItem.yieldPercent || '')} onChange={(v) => setEditItem({ ...editItem, yieldPercent: Number(v) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="สวนต้นทาง (Traceability)" value={editItem.sourceSupplier || ''} onChange={(v) => setEditItem({ ...editItem, sourceSupplier: v })} />
              <FormInput label="วันที่รับซื้อ" type="date" value={editItem.sourceDate || ''} onChange={(v) => setEditItem({ ...editItem, sourceDate: v })} />
            </div>

            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">รายการบรรจุ</h3>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> เพิ่มรายการ</Button>
              </div>
              {editItems.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <FormSelect label="สินค้า" value={item.productId} onChange={(v) => updateItem(idx, 'productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
                    <FormSelect label="เกรด" value={item.gradeId} onChange={(v) => updateItem(idx, 'gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
                    <FormInput label="จำนวน" type="number" value={String(item.quantity)} onChange={(v) => updateItem(idx, 'quantity', Number(v))} />
                    <FormSelect label="หน่วยนับ" value={item.unitId} onChange={(v) => updateItem(idx, 'unitId', v)} options={mockUnits.map((u) => ({ value: u.id, label: u.name }))} />
                    <FormInput label="ราคา/หน่วย" type="number" value={String(item.pricePerUnit)} onChange={(v) => updateItem(idx, 'pricePerUnit', Number(v))} />
                  </div>
                  <p className="text-right text-sm mt-1 font-semibold">= ฿{fmt(item.quantity * item.pricePerUnit)}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
