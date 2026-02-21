import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Sales, SalesItem, mockSales } from '@/data/mockTransactions';
import { mockCustomers, mockProducts, mockGrades, mockUnits, mockBankAccounts } from '@/data/mockData';

// ===== Shared print helper =====
function printHtml(html: string) {
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

const baseStyle = `
  @media print { @page { size: A4; margin: 12mm 18mm; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Tahoma', sans-serif; font-size: 13px; color: #1a1a1a; padding: 16px; }
  .header { text-align: center; margin-bottom: 16px; border-bottom: 3px double #333; padding-bottom: 12px; }
  .header h1 { font-size: 20px; font-weight: bold; }
  .header h2 { font-size: 16px; font-weight: bold; margin-top: 2px; }
  .header h3 { font-size: 12px; color: #666; }
  .doc-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13px; }
  .section { margin-bottom: 14px; }
  .section-title { font-size: 13px; font-weight: bold; background: #f0f0f0; padding: 5px 10px; margin-bottom: 6px; border-left: 4px solid #333; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 20px; padding: 0 10px; font-size: 13px; }
  .info-row { display: flex; gap: 6px; }
  .info-label { font-weight: bold; min-width: 110px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #bbb; padding: 6px 8px; font-size: 12px; }
  th { background: #f5f5f5; font-weight: bold; text-align: center; }
  td.number { text-align: right; font-family: monospace; }
  td.center { text-align: center; }
  .total-row td { font-weight: bold; background: #fafafa; font-size: 13px; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 36px; text-align: center; }
  .sig-box { padding-top: 45px; border-top: 1px solid #333; font-size: 12px; }
  .sig-label { font-size: 10px; color: #666; margin-top: 2px; }
  .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 6px; }
  .summary { border: 1px solid #bbb; padding: 10px; margin-top: 8px; }
  .summary-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 13px; }
  .summary-row.total { font-size: 15px; font-weight: bold; border-top: 2px solid #333; padding-top: 6px; margin-top: 4px; }
  .stamp { display: inline-block; border: 2px solid #16a34a; color: #16a34a; padding: 3px 12px; font-size: 13px; font-weight: bold; transform: rotate(-5deg); }
`;

const fmt2 = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2 });

function itemRows(items: SalesItem[]) {
  return items.map((item, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td>${item.productName}</td>
      <td>${item.gradeName}</td>
      <td class="center">${item.quantity}</td>
      <td>${item.unitName}</td>
      <td class="number">${fmt2(item.pricePerUnit)}</td>
      <td class="number">${fmt2(item.amount)}</td>
    </tr>`).join('');
}

// ===== INVOICE =====
function printInvoice(s: Sales) {
  const bank = mockBankAccounts.find(b => b.id === s.bankAccountId);
  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"/><title>Invoice ${s.docNo}</title>
<style>${baseStyle}</style></head><body>
  <div class="header">
    <h1>🍈 ล้งทุเรียน — DURIAN PACKING HOUSE</h1>
    <h2>INVOICE / ใบแจ้งหนี้</h2>
  </div>
  <div class="doc-row">
    <div><strong>Invoice No:</strong> INV-${s.docNo.replace('SL-', '')}</div>
    <div><strong>Date:</strong> ${s.date}</div>
    <div><span class="stamp">ORIGINAL</span></div>
  </div>
  <div class="section">
    <div class="section-title">Bill To / ลูกค้า</div>
    <div class="info-grid">
      <div class="info-row"><span class="info-label">Customer:</span><span>${s.customerName}</span></div>
      <div class="info-row"><span class="info-label">Container No:</span><span>${s.containerNo}</span></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Items / รายการสินค้า</div>
    <table>
      <thead><tr>
        <th style="width:5%">No.</th><th>Description</th><th>Grade</th><th>Qty</th><th>Unit</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Amount (THB)</th>
      </tr></thead>
      <tbody>
        ${itemRows(s.items)}
        <tr class="total-row">
          <td colspan="6" style="text-align:right;">Sub Total</td>
          <td class="number">฿${fmt2(s.totalAmount)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="section">
    <div class="summary">
      <div class="summary-row"><span>Sub Total</span><span>฿${fmt2(s.totalAmount)}</span></div>
      <div class="summary-row"><span>Less: Deposit</span><span>- ฿${fmt2(s.deposit)}</span></div>
      <div class="summary-row total"><span>Net Amount Due</span><span>฿${fmt2(s.netAmount)}</span></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Payment / การชำระเงิน</div>
    <div class="info-grid">
      <div class="info-row"><span class="info-label">Payment:</span><span>${s.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Deposit Deduction'}</span></div>
      ${bank ? `<div class="info-row"><span class="info-label">Bank:</span><span>${bank.bank} - ${bank.accountNo} (${bank.name})</span></div>` : ''}
    </div>
  </div>
  <div class="signatures">
    <div><div class="sig-box">Prepared By / ผู้จัดทำ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">Approved By / ผู้อนุมัติ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">Received By / ผู้รับ</div><div class="sig-label">Date ____/____/____</div></div>
  </div>
  <div class="footer">Printed from ล้งทุเรียน System — ${new Date().toLocaleString('th-TH')}</div>
</body></html>`;
  printHtml(html);
}

// ===== PACKING LIST =====
function printPackingList(s: Sales) {
  const totalQty = s.items.reduce((sum, i) => sum + i.quantity, 0);
  const plRows = s.items.map((item, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td>${item.productName}</td>
      <td>${item.gradeName}</td>
      <td class="center">${item.quantity}</td>
      <td>${item.unitName}</td>
      <td class="number">${(item.quantity * 10).toFixed(1)} kg</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"/><title>Packing List ${s.docNo}</title>
<style>${baseStyle}
  .watermark { position: fixed; top: 40%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 80px; color: rgba(0,0,0,0.04); font-weight: bold; pointer-events: none; z-index: 0; }
</style></head><body>
  <div class="watermark">PACKING LIST</div>
  <div class="header">
    <h1>🍈 ล้งทุเรียน — DURIAN PACKING HOUSE</h1>
    <h2>PACKING LIST / ใบรายการบรรจุ</h2>
  </div>
  <div class="doc-row">
    <div><strong>P/L No:</strong> PL-${s.docNo.replace('SL-', '')}</div>
    <div><strong>Date:</strong> ${s.date}</div>
  </div>
  <div class="section">
    <div class="section-title">Shipment Details / ข้อมูลการจัดส่ง</div>
    <div class="info-grid">
      <div class="info-row"><span class="info-label">Customer:</span><span>${s.customerName}</span></div>
      <div class="info-row"><span class="info-label">Container No:</span><span>${s.containerNo}</span></div>
      <div class="info-row"><span class="info-label">Invoice Ref:</span><span>INV-${s.docNo.replace('SL-', '')}</span></div>
      <div class="info-row"><span class="info-label">Loading Date:</span><span>${s.date}</span></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Packed Items / รายการบรรจุ</div>
    <table>
      <thead><tr>
        <th style="width:5%">No.</th><th>Product</th><th>Grade</th><th>Packages</th><th>Unit</th><th style="text-align:right">Net Weight</th>
      </tr></thead>
      <tbody>
        ${plRows}
        <tr class="total-row">
          <td colspan="3" style="text-align:right;">Total</td>
          <td class="center">${totalQty}</td>
          <td></td>
          <td class="number">${(totalQty * 10).toFixed(1)} kg</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="section">
    <div class="section-title">Sampling / การสุ่มตัวอย่าง</div>
    <div class="info-grid">
      <div class="info-row"><span class="info-label">Sample Date:</span><span>${s.sampleDate || '-'}</span></div>
      <div class="info-row"><span class="info-label">Collector:</span><span>${s.sampleCollector || '-'}</span></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Container Condition / สภาพตู้คอนเทนเนอร์</div>
    <div style="padding:8px 10px; font-size:12px; line-height:1.8;">
      <p>☐ สะอาด ไม่มีกลิ่น &nbsp;&nbsp; ☐ อุณหภูมิ ____°C &nbsp;&nbsp; ☐ ไม่มีรอยรั่ว/เสียหาย</p>
      <p>☐ ซีลตู้เลขที่: __________________ &nbsp;&nbsp; ☐ ตรวจสอบแล้วพร้อมส่ง</p>
    </div>
  </div>
  <div class="signatures">
    <div><div class="sig-box">Packed By / ผู้บรรจุ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">Checked By / ผู้ตรวจ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">Approved By / ผู้อนุมัติ</div><div class="sig-label">Date ____/____/____</div></div>
  </div>
  <div class="footer">Printed from ล้งทุเรียน System — ${new Date().toLocaleString('th-TH')}</div>
</body></html>`;
  printHtml(html);
}

// ===== GAP CERTIFICATE =====
function printGAP(s: Sales) {
  const productList = s.items.map(i => `${i.productName} (${i.gradeName})`).join(', ');
  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"/><title>GAP Certificate ${s.docNo}</title>
<style>${baseStyle}
  .cert-border { border: 3px solid #16a34a; padding: 20px; margin: 10px 0; }
  .cert-title { text-align: center; font-size: 20px; font-weight: bold; color: #16a34a; margin-bottom: 16px; }
  .cert-subtitle { text-align: center; font-size: 14px; color: #555; margin-bottom: 20px; }
  .cert-body { font-size: 13px; line-height: 2; padding: 0 16px; }
  .cert-body strong { color: #16a34a; }
  .cert-seal { text-align: center; margin-top: 24px; }
  .seal-circle { display: inline-block; width: 80px; height: 80px; border: 3px solid #16a34a; border-radius: 50%; line-height: 80px; font-size: 12px; font-weight: bold; color: #16a34a; }
  .gap-badge { display: inline-block; background: #16a34a; color: #fff; padding: 6px 20px; border-radius: 4px; font-size: 16px; font-weight: bold; margin: 8px 0; }
</style></head><body>
  <div class="header">
    <h1>🍈 ล้งทุเรียน — DURIAN PACKING HOUSE</h1>
    <h2>🇹🇭 KINGDOM OF THAILAND</h2>
    <h3>Department of Agriculture</h3>
  </div>

  <div class="cert-border">
    <div class="cert-title">CERTIFICATE OF GOOD AGRICULTURAL PRACTICE</div>
    <div style="text-align:center;"><div class="gap-badge">GAP CERTIFIED</div></div>
    <div class="cert-subtitle">ใบรับรองมาตรฐานการปฏิบัติทางการเกษตรที่ดี</div>

    <div class="cert-body">
      <p>Certificate No: <strong>GAP-${s.docNo.replace('SL-', '')}</strong></p>
      <p>This is to certify that the following products have been produced, packed and handled in accordance with <strong>Good Agricultural Practice (GAP)</strong> standards as prescribed by the Department of Agriculture, Thailand.</p>

      <div style="margin: 16px 0; padding: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px;">
        <p><strong>Products:</strong> ${productList}</p>
        <p><strong>Quantity:</strong> ${s.items.reduce((sum, i) => sum + i.quantity, 0)} packages</p>
        <p><strong>Container No:</strong> ${s.containerNo}</p>
        <p><strong>Destination:</strong> ${s.customerName}</p>
        <p><strong>Export Date:</strong> ${s.date}</p>
        <p><strong>Invoice Ref:</strong> INV-${s.docNo.replace('SL-', '')}</p>
      </div>

      <p>The products listed above comply with the following requirements:</p>
      <p style="padding-left: 16px;">
        ✅ Pesticide residue within MRL limits<br/>
        ✅ Traceability from farm to packing house<br/>
        ✅ Proper post-harvest handling and cold chain management<br/>
        ✅ Phytosanitary inspection passed<br/>
        ✅ No signs of pest or disease
      </p>

      <div style="margin-top: 16px;">
        <p><strong>Sampling Date:</strong> ${s.sampleDate || '-'}</p>
        <p><strong>Sample Collector:</strong> ${s.sampleCollector || '-'}</p>
      </div>
    </div>

    <div class="cert-seal">
      <div class="seal-circle">GAP<br/>🇹🇭</div>
      <p style="font-size: 10px; color: #666; margin-top: 6px;">Official Seal</p>
    </div>
  </div>

  <div class="signatures">
    <div><div class="sig-box">Inspector / ผู้ตรวจสอบ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">QC Manager / ผู้จัดการคุณภาพ</div><div class="sig-label">Date ____/____/____</div></div>
    <div><div class="sig-box">Authorized Signatory / ผู้มีอำนาจ</div><div class="sig-label">Date ____/____/____</div></div>
  </div>
  <div class="footer">Printed from ล้งทุเรียน System — ${new Date().toLocaleString('th-TH')}</div>
</body></html>`;
  printHtml(html);
}

// ===== MAIN COMPONENT =====
export default function SalesPage() {
  const [data, setData] = useState<Sales[]>(mockSales);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Sales>>({});
  const [editItems, setEditItems] = useState<SalesItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = data.filter((s) => [s.docNo, s.containerNo, s.customerName].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  const fmt = (n: number) => n.toLocaleString('th-TH');

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    preparing: { label: 'เตรียมของ', variant: 'secondary' },
    loading: { label: 'กำลังโหลด', variant: 'outline' },
    exported: { label: 'ส่งออกแล้ว', variant: 'default' },
    paid: { label: 'รับเงินแล้ว', variant: 'default' },
  };

  const openAdd = () => {
    setEditItem({ date: new Date().toISOString().split('T')[0], docNo: `SL-2568-${String(data.length + 1).padStart(4, '0')}`, deposit: 0, paymentMethod: 'transfer' });
    setEditItems([]);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const addItem = () => {
    setEditItems([...editItems, { productId: '', productName: '', gradeId: '', gradeName: '', quantity: 0, unitId: '', unitName: '', pricePerUnit: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: keyof SalesItem, value: any) => {
    const items = [...editItems];
    (items[idx] as any)[field] = value;
    if (field === 'productId') items[idx].productName = mockProducts.find((p) => p.id === value)?.name || '';
    if (field === 'gradeId') items[idx].gradeName = mockGrades.find((g) => g.id === value)?.name || '';
    if (field === 'unitId') items[idx].unitName = mockUnits.find((u) => u.id === value)?.name || '';
    items[idx].amount = items[idx].quantity * items[idx].pricePerUnit;
    setEditItems(items);
  };

  const handleSave = () => {
    const totalAmount = editItems.reduce((s, i) => s + i.amount, 0);
    const customer = mockCustomers.find((c) => c.id === editItem.customerId);
    const sale: Sales = {
      id: isEditing ? editItem.id! : String(Date.now()),
      docNo: editItem.docNo || '', date: editItem.date || '', containerNo: editItem.containerNo || '',
      customerId: editItem.customerId || '', customerName: customer?.name || '',
      items: editItems, totalAmount, deposit: editItem.deposit || 0, netAmount: totalAmount - (editItem.deposit || 0),
      paymentMethod: editItem.paymentMethod as any || 'transfer', bankAccountId: editItem.bankAccountId || '',
      sampleDate: editItem.sampleDate || '', sampleCollector: editItem.sampleCollector || '',
      status: 'preparing',
    };
    if (isEditing) setData(data.map((d) => (d.id === sale.id ? sale : d)));
    else setData([...data, sale]);
    toast.success('บันทึกเรียบร้อย');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold">ขาย/ส่งออก (Sales/Export)</h1>
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
              <TableHead className="text-xs">เลขตู้</TableHead>
              <TableHead className="text-xs">ลูกค้า</TableHead>
              <TableHead className="text-xs text-right">มูลค่า</TableHead>
              <TableHead className="text-xs text-center">สถานะ</TableHead>
              <TableHead className="text-xs text-center">เอกสาร</TableHead>
              <TableHead className="text-xs text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, idx) => (
              <TableRow key={s.id} className="hover:bg-muted/30">
                <TableCell className="text-xs">{idx + 1}</TableCell>
                <TableCell className="text-sm">{s.date}</TableCell>
                <TableCell className="text-sm font-mono">{s.docNo}</TableCell>
                <TableCell className="text-sm font-mono">{s.containerNo}</TableCell>
                <TableCell className="text-sm">{s.customerName}</TableCell>
                <TableCell className="text-sm text-right font-semibold">฿{fmt(s.netAmount)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={statusMap[s.status]?.variant || 'secondary'} className="text-[10px]">
                    {statusMap[s.status]?.label || s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1" onClick={() => printInvoice(s)}>
                      <FileText className="h-3 w-3 mr-0.5" />Invoice
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1" onClick={() => printPackingList(s)}>
                      <FileText className="h-3 w-3 mr-0.5" />PackList
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1" onClick={() => printGAP(s)}>
                      <FileText className="h-3 w-3 mr-0.5" />GAP
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-info" onClick={() => { setEditItem({ ...s }); setEditItems([...s.items]); setIsEditing(true); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setData(data.filter((d) => d.id !== s.id)); toast.success('ลบเรียบร้อย'); }}>
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
          <DialogHeader><DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}ขาย/ส่งออก</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="วันที่" type="date" value={editItem.date || ''} onChange={(v) => setEditItem({ ...editItem, date: v })} />
              <FormInput label="เลขที่" value={editItem.docNo || ''} onChange={(v) => setEditItem({ ...editItem, docNo: v })} />
              <FormInput label="เลขตู้ Container" value={editItem.containerNo || ''} onChange={(v) => setEditItem({ ...editItem, containerNo: v })} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormSelect label="ลูกค้า" value={editItem.customerId || ''} onChange={(v) => setEditItem({ ...editItem, customerId: v })} options={mockCustomers.map((c) => ({ value: c.id, label: c.name }))} />
              <FormInput label="วันที่สุ่มตัวอย่าง" type="date" value={editItem.sampleDate || ''} onChange={(v) => setEditItem({ ...editItem, sampleDate: v })} />
              <FormInput label="ผู้ส่งเก็บตัวอย่าง" value={editItem.sampleCollector || ''} onChange={(v) => setEditItem({ ...editItem, sampleCollector: v })} />
            </div>

            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">รายการสินค้า</h3>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> เพิ่มรายการ</Button>
              </div>
              {editItems.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <FormSelect label="สินค้า" value={item.productId} onChange={(v) => updateItem(idx, 'productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
                    <FormSelect label="เกรด" value={item.gradeId} onChange={(v) => updateItem(idx, 'gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
                    <FormInput label="จำนวน" type="number" value={String(item.quantity)} onChange={(v) => updateItem(idx, 'quantity', Number(v))} />
                    <FormSelect label="หน่วย" value={item.unitId} onChange={(v) => updateItem(idx, 'unitId', v)} options={mockUnits.map((u) => ({ value: u.id, label: u.name }))} />
                    <FormInput label="ราคา/หน่วย" type="number" value={String(item.pricePerUnit)} onChange={(v) => updateItem(idx, 'pricePerUnit', Number(v))} />
                  </div>
                  <p className="text-right text-sm mt-1 font-semibold">= ฿{fmt(item.quantity * item.pricePerUnit)}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="หักมัดจำ" type="number" value={String(editItem.deposit || 0)} onChange={(v) => setEditItem({ ...editItem, deposit: Number(v) })} />
              <FormSelect label="รับชำระโดย" value={editItem.paymentMethod || ''} onChange={(v) => setEditItem({ ...editItem, paymentMethod: v as any })} options={[{ value: 'deposit-deduct', label: 'หักมัดจำ' }, { value: 'transfer', label: 'โอน' }]} />
              <FormSelect label="บัญชี" value={editItem.bankAccountId || ''} onChange={(v) => setEditItem({ ...editItem, bankAccountId: v })} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
            </div>

            <div className="bg-muted/50 rounded-md p-3 text-right">
              <p className="text-base font-bold text-primary">ยอดสุทธิ: ฿{fmt(editItems.reduce((s, i) => s + i.amount, 0) - (editItem.deposit || 0))}</p>
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
