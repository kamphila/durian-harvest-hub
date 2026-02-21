import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Printer, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Purchase, PurchaseItem, mockPurchases } from '@/data/mockTransactions';
import { mockSuppliers, mockCuttingTeams, mockProducts, mockGrades, mockBankAccounts } from '@/data/mockData';

function numberToThaiText(n: number): string {
  if (n === 0) return 'ศูนย์บาทถ้วน';
  const digits = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  const baht = Math.floor(n);
  const satang = Math.round((n - baht) * 100);
  let result = '';
  const str = baht.toString();
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const d = parseInt(str[i]);
    const pos = len - i - 1;
    if (d === 0) continue;
    if (pos === 1 && d === 1) { result += 'สิบ'; continue; }
    if (pos === 1 && d === 2) { result += 'ยี่สิบ'; continue; }
    if (pos === 0 && d === 1 && len > 1) { result += 'เอ็ด'; continue; }
    result += digits[d] + positions[pos];
  }
  result += 'บาท';
  if (satang === 0) { result += 'ถ้วน'; } else {
    const s = satang.toString().padStart(2, '0');
    const s1 = parseInt(s[0]), s2 = parseInt(s[1]);
    if (s1 === 1) result += 'สิบ';
    else if (s1 === 2) result += 'ยี่สิบ';
    else if (s1 > 0) result += digits[s1] + 'สิบ';
    if (s2 === 1 && s1 > 0) result += 'เอ็ด';
    else if (s2 > 0) result += digits[s2];
    result += 'สตางค์';
  }
  return result;
}

function printDebtDocument(p: Purchase) {
  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  const bank = mockBankAccounts.find(b => b.id === p.bankAccountId);
  const paymentLabel = p.paymentMethod === 'cash' ? 'เงินสด' : 'โอนเงิน';

  const itemRows = p.items.map((item, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td>${item.productName}</td>
      <td>${item.gradeName}</td>
      <td class="center">${item.baskets.length}</td>
      <td class="number">${fmt(item.totalWeight)}</td>
      <td class="number">${fmt(item.pricePerKg)}</td>
      <td class="number">${fmt(item.amount)}</td>
    </tr>`).join('');

  const basketDetails = p.items.map((item, idx) => {
    const bList = item.baskets.map(b => `เข่ง#${b.basketNo}: ${b.weight} กก.`).join(', ');
    return `<p><strong>รายการ ${idx + 1} (${item.productName} ${item.gradeName}):</strong> ${bList}</p>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>ใบตั้งหนี้ ${p.docNo}</title>
<style>
  @media print { @page { size: A4; margin: 12mm 18mm; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Tahoma', sans-serif; font-size: 13px; color: #1a1a1a; padding: 16px; }
  .header { text-align: center; margin-bottom: 18px; border-bottom: 3px double #333; padding-bottom: 12px; }
  .header h1 { font-size: 20px; font-weight: bold; margin-bottom: 2px; }
  .header h2 { font-size: 16px; font-weight: bold; }
  .header h3 { font-size: 12px; font-weight: normal; color: #666; }
  .doc-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13px; }
  .stamp { display: inline-block; border: 2px solid; padding: 3px 12px; font-size: 13px; font-weight: bold; transform: rotate(-5deg); }
  .stamp.paid { border-color: #16a34a; color: #16a34a; }
  .stamp.draft { border-color: #f59e0b; color: #f59e0b; }
  .section { margin-bottom: 14px; }
  .section-title { font-size: 13px; font-weight: bold; background: #f0f0f0; padding: 5px 10px; margin-bottom: 6px; border-left: 4px solid #333; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 20px; padding: 0 10px; font-size: 13px; }
  .info-row { display: flex; gap: 6px; }
  .info-label { font-weight: bold; min-width: 100px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #bbb; padding: 6px 8px; font-size: 12px; }
  th { background: #f5f5f5; font-weight: bold; text-align: center; }
  td.number { text-align: right; font-family: monospace; }
  td.center { text-align: center; }
  .total-row td { font-weight: bold; background: #fafafa; font-size: 13px; }
  .summary { border: 1px solid #bbb; padding: 10px; margin-top: 10px; }
  .summary-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 13px; }
  .summary-row.total { font-size: 15px; font-weight: bold; border-top: 2px solid #333; padding-top: 6px; margin-top: 4px; }
  .amount-words { padding: 6px 10px; font-size: 12px; background: #fafafa; border: 1px solid #bbb; border-top: 0; }
  .basket-detail { padding: 6px 10px; font-size: 11px; color: #555; line-height: 1.6; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 36px; text-align: center; }
  .sig-box { padding-top: 45px; border-top: 1px solid #333; font-size: 12px; }
  .sig-label { font-size: 10px; color: #666; margin-top: 2px; }
  .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 6px; }
</style>
</head>
<body>
  <div class="header">
    <h1>🍈 ระบบล้งทุเรียน</h1>
    <h2>ใบตั้งหนี้ / ใบรับซื้อ (Accounts Payable Voucher)</h2>
    <h3>เอกสารตั้งหนี้จากการรับซื้อผลผลิต</h3>
  </div>

  <div class="doc-row">
    <div><strong>เลขที่เอกสาร:</strong> ${p.docNo}</div>
    <div><strong>วันที่:</strong> ${p.date}</div>
    <div><span class="stamp ${p.status}">${p.status === 'paid' ? 'จ่ายแล้ว' : 'ร่าง'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">ข้อมูลผู้จำหน่าย / สายตัด</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">ผู้จำหน่าย (สวน):</span>
        <span>${p.supplierName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">สายตัด:</span>
        <span>${p.cuttingTeamName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">ทะเบียนรถ:</span>
        <span>${p.licensePlate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">วิธีชำระเงิน:</span>
        <span>${paymentLabel}</span>
      </div>
      ${bank ? `<div class="info-row">
        <span class="info-label">บัญชีธนาคาร:</span>
        <span>${bank.bank} - ${bank.accountNo} (${bank.name})</span>
      </div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">รายละเอียดสินค้าที่รับซื้อ</div>
    <table>
      <thead>
        <tr>
          <th style="width:5%">ลำดับ</th>
          <th>สินค้า</th>
          <th>เกรด</th>
          <th>จำนวนเข่ง</th>
          <th style="text-align:right">น้ำหนัก (กก.)</th>
          <th style="text-align:right">ราคา/กก.</th>
          <th style="text-align:right">จำนวนเงิน (บาท)</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td colspan="4" style="text-align:right;">รวมทั้งหมด</td>
          <td class="number">${fmt(p.totalWeight)}</td>
          <td></td>
          <td class="number">฿${fmt(p.totalAmount)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">รายละเอียดเข่ง</div>
    <div class="basket-detail">
      ${basketDetails}
    </div>
  </div>

  <div class="section">
    <div class="section-title">สรุปยอดเงิน</div>
    <div class="summary">
      <div class="summary-row"><span>รวมค่าสินค้า</span><span>฿${fmt(p.totalAmount)}</span></div>
      <div class="summary-row"><span>หักมัดจำล่วงหน้า</span><span>- ฿${fmt(p.deposit)}</span></div>
      <div class="summary-row total"><span>ยอดตั้งหนี้สุทธิ</span><span>฿${fmt(p.netAmount)}</span></div>
    </div>
    <div class="amount-words">
      <strong>จำนวนเงิน (ตัวอักษร):</strong> ${numberToThaiText(p.netAmount)}
    </div>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-box">ผู้รับซื้อ / ผู้ตั้งหนี้</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
    <div>
      <div class="sig-box">ผู้จำหน่าย / เจ้าหนี้</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
    <div>
      <div class="sig-box">ผู้อนุมัติ</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
  </div>

  <div class="footer">
    เอกสารนี้พิมพ์จากระบบล้งทุเรียน — พิมพ์เมื่อ ${new Date().toLocaleString('th-TH')}
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

export default function PurchasePage() {
  const [data, setData] = useState<Purchase[]>(mockPurchases);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [editItem, setEditItem] = useState<Partial<Purchase>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<PurchaseItem[]>([]);

  const filtered = data.filter((p) =>
    [p.docNo, p.supplierName, p.cuttingTeamName, p.licensePlate]
      .some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditItem({ date: new Date().toISOString().split('T')[0], docNo: `PU-2568-${String(data.length + 1).padStart(4, '0')}`, paymentMethod: 'transfer', deposit: 0 });
    setEditItems([]);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (p: Purchase) => {
    setEditItem({ ...p });
    setEditItems([...p.items]);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const addItem = () => {
    setEditItems([...editItems, { productId: '', productName: '', gradeId: '', gradeName: '', baskets: [{ basketNo: 1, weight: 0 }], totalWeight: 0, pricePerKg: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: keyof PurchaseItem, value: any) => {
    const items = [...editItems];
    (items[idx] as any)[field] = value;
    if (field === 'productId') {
      const p = mockProducts.find((p) => p.id === value);
      items[idx].productName = p?.name || '';
    }
    if (field === 'gradeId') {
      const g = mockGrades.find((g) => g.id === value);
      items[idx].gradeName = g?.name || '';
    }
    items[idx].totalWeight = items[idx].baskets.reduce((s, b) => s + b.weight, 0);
    items[idx].amount = items[idx].totalWeight * items[idx].pricePerKg;
    setEditItems(items);
  };

  const addBasket = (itemIdx: number) => {
    const items = [...editItems];
    items[itemIdx].baskets.push({ basketNo: items[itemIdx].baskets.length + 1, weight: 0 });
    setEditItems(items);
  };

  const updateBasket = (itemIdx: number, basketIdx: number, weight: number) => {
    const items = [...editItems];
    items[itemIdx].baskets[basketIdx].weight = weight;
    items[itemIdx].totalWeight = items[itemIdx].baskets.reduce((s, b) => s + b.weight, 0);
    items[itemIdx].amount = items[itemIdx].totalWeight * items[itemIdx].pricePerKg;
    setEditItems(items);
  };

  const handleSave = () => {
    const totalWeight = editItems.reduce((s, i) => s + i.totalWeight, 0);
    const totalAmount = editItems.reduce((s, i) => s + i.amount, 0);
    const deposit = editItem.deposit || 0;
    const supplier = mockSuppliers.find((s) => s.id === editItem.supplierId);
    const ct = mockCuttingTeams.find((c) => c.id === editItem.cuttingTeamId);

    const purchase: Purchase = {
      id: isEditing ? editItem.id! : String(Date.now()),
      docNo: editItem.docNo || '',
      date: editItem.date || '',
      supplierId: editItem.supplierId || '',
      supplierName: supplier?.name || '',
      cuttingTeamId: editItem.cuttingTeamId || '',
      cuttingTeamName: ct?.name || '',
      licensePlate: editItem.licensePlate || ct?.licensePlate || '',
      items: editItems,
      totalWeight,
      totalAmount,
      deposit,
      netAmount: totalAmount - deposit,
      paymentMethod: editItem.paymentMethod as any || 'cash',
      bankAccountId: editItem.bankAccountId || '',
      status: 'draft',
    };

    if (isEditing) {
      setData(data.map((d) => (d.id === purchase.id ? purchase : d)));
    } else {
      setData([...data, purchase]);
    }
    toast.success(isEditing ? 'แก้ไขเรียบร้อย' : 'เพิ่มเรียบร้อย');
    setDialogOpen(false);
  };

  const fmt = (n: number) => n.toLocaleString('th-TH');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold">รับซื้อ (Purchase Intake)</h1>
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
              <TableHead className="text-xs">ทะเบียนรถ</TableHead>
              <TableHead className="text-xs">สายตัด</TableHead>
              <TableHead className="text-xs">ผู้จำหน่าย</TableHead>
              <TableHead className="text-xs text-right">น้ำหนัก(กก.)</TableHead>
              <TableHead className="text-xs text-right">จำนวนเงิน</TableHead>
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
                <TableCell className="text-sm">{p.licensePlate}</TableCell>
                <TableCell className="text-sm">{p.cuttingTeamName}</TableCell>
                <TableCell className="text-sm">{p.supplierName}</TableCell>
                <TableCell className="text-sm text-right">{fmt(p.totalWeight)}</TableCell>
                <TableCell className="text-sm text-right font-semibold">฿{fmt(p.netAmount)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className="text-[10px]">
                    {p.status === 'paid' ? 'จ่ายแล้ว' : 'ร่าง'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => printDebtDocument(p)} title="พิมพ์ใบตั้งหนี้">
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedPurchase(p); setDetailOpen(true); }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-info" onClick={() => openEdit(p)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}รับซื้อ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="วันที่" type="date" value={editItem.date || ''} onChange={(v) => setEditItem({ ...editItem, date: v })} />
              <FormInput label="เลขที่เอกสาร" value={editItem.docNo || ''} onChange={(v) => setEditItem({ ...editItem, docNo: v })} />
              <FormSelect label="ผู้จำหน่าย" value={editItem.supplierId || ''} onChange={(v) => setEditItem({ ...editItem, supplierId: v })} options={mockSuppliers.map((s) => ({ value: s.id, label: s.name }))} />
              <FormSelect label="สายตัด" value={editItem.cuttingTeamId || ''} onChange={(v) => {
                const ct = mockCuttingTeams.find((c) => c.id === v);
                setEditItem({ ...editItem, cuttingTeamId: v, licensePlate: ct?.licensePlate || editItem.licensePlate });
              }} options={mockCuttingTeams.map((c) => ({ value: c.id, label: c.name }))} />
              <FormInput label="ทะเบียนรถ" value={editItem.licensePlate || ''} onChange={(v) => setEditItem({ ...editItem, licensePlate: v })} />
            </div>

            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">รายการสินค้า</h3>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> เพิ่มรายการ</Button>
              </div>
              {editItems.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <FormSelect label="สินค้า" value={item.productId} onChange={(v) => updateItem(idx, 'productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
                    <FormSelect label="เกรด" value={item.gradeId} onChange={(v) => updateItem(idx, 'gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
                    <FormInput label="ราคา/กก." type="number" value={String(item.pricePerKg)} onChange={(v) => updateItem(idx, 'pricePerKg', Number(v))} />
                    <div className="text-right pt-5">
                      <span className="text-xs text-muted-foreground">น้ำหนัก: </span>
                      <span className="font-bold">{item.totalWeight} กก.</span>
                      <span className="text-xs text-muted-foreground ml-2">= ฿{fmt(item.amount)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">เข่ง:</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => addBasket(idx)}>+ เข่ง</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.baskets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">#{b.basketNo}</span>
                          <Input type="number" className="w-20 h-7 text-sm" value={b.weight || ''} onChange={(e) => updateBasket(idx, bIdx, Number(e.target.value))} placeholder="กก." />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormInput label="หักมัดจำ" type="number" value={String(editItem.deposit || 0)} onChange={(v) => setEditItem({ ...editItem, deposit: Number(v) })} />
              <FormSelect label="ชำระโดย" value={editItem.paymentMethod || ''} onChange={(v) => setEditItem({ ...editItem, paymentMethod: v as any })} options={[{ value: 'cash', label: 'เงินสด' }, { value: 'transfer', label: 'โอน' }]} />
              {editItem.paymentMethod === 'transfer' && (
                <FormSelect label="บัญชี" value={editItem.bankAccountId || ''} onChange={(v) => setEditItem({ ...editItem, bankAccountId: v })} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
              )}
            </div>

            <div className="bg-muted/50 rounded-md p-3 text-right space-y-1">
              <p className="text-sm">น้ำหนักรวม: <strong>{editItems.reduce((s, i) => s + i.totalWeight, 0)} กก.</strong></p>
              <p className="text-sm">รวมเงิน: <strong>฿{fmt(editItems.reduce((s, i) => s + i.amount, 0))}</strong></p>
              <p className="text-sm">หักมัดจำ: <strong>฿{fmt(editItem.deposit || 0)}</strong></p>
              <p className="text-base font-bold text-primary">ยอดสุทธิ: ฿{fmt(editItems.reduce((s, i) => s + i.amount, 0) - (editItem.deposit || 0))}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ใบรับซื้อ {selectedPurchase?.docNo}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-muted-foreground">วันที่:</span> {selectedPurchase.date}</p>
                <p><span className="text-muted-foreground">ผู้จำหน่าย:</span> {selectedPurchase.supplierName}</p>
                <p><span className="text-muted-foreground">สายตัด:</span> {selectedPurchase.cuttingTeamName}</p>
                <p><span className="text-muted-foreground">ทะเบียน:</span> {selectedPurchase.licensePlate}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">สินค้า</TableHead>
                    <TableHead className="text-xs">เกรด</TableHead>
                    <TableHead className="text-xs text-right">น้ำหนัก</TableHead>
                    <TableHead className="text-xs text-right">ราคา/กก.</TableHead>
                    <TableHead className="text-xs text-right">จำนวนเงิน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchase.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.gradeName}</TableCell>
                      <TableCell className="text-right">{fmt(item.totalWeight)} กก.</TableCell>
                      <TableCell className="text-right">฿{fmt(item.pricePerKg)}</TableCell>
                      <TableCell className="text-right font-semibold">฿{fmt(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right space-y-1 border-t pt-2">
                <p>รวม: ฿{fmt(selectedPurchase.totalAmount)}</p>
                <p>หักมัดจำ: ฿{fmt(selectedPurchase.deposit)}</p>
                <p className="text-lg font-bold text-primary">สุทธิ: ฿{fmt(selectedPurchase.netAmount)}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => printDebtDocument(selectedPurchase)}><Printer className="h-4 w-4 mr-1" /> พิมพ์ใบตั้งหนี้</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
