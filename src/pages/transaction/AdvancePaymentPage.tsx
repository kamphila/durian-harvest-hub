import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdvancePayment, mockAdvancePayments, mockContracts } from '@/data/mockTransactions';
import { mockCuttingTeams, mockProducts, mockGrades } from '@/data/mockData';
import { Printer } from 'lucide-react';

function printVoucher(item: AdvancePayment) {
  const contract = mockContracts.find(c => c.docNo === item.contractNo);
  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  const statusLabel = item.status === 'deducted' ? 'หักแล้ว' : 'รอหัก';

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>ใบสำคัญจ่าย ${item.docNo}</title>
<style>
  @media print { @page { size: A4; margin: 15mm 20mm; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Tahoma', sans-serif; font-size: 14px; color: #1a1a1a; padding: 20px; }
  .header { text-align: center; margin-bottom: 20px; border-bottom: 3px double #333; padding-bottom: 14px; }
  .header h1 { font-size: 22px; font-weight: bold; margin-bottom: 2px; }
  .header h2 { font-size: 17px; font-weight: bold; color: #333; }
  .header h3 { font-size: 13px; font-weight: normal; color: #666; }
  .doc-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; }
  .stamp { display: inline-block; border: 2px solid; padding: 3px 14px; font-size: 13px; font-weight: bold; transform: rotate(-5deg); }
  .stamp.deducted { border-color: #16a34a; color: #16a34a; }
  .stamp.pending { border-color: #f59e0b; color: #f59e0b; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 13px; font-weight: bold; background: #f0f0f0; padding: 5px 10px; margin-bottom: 6px; border-left: 4px solid #333; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; padding: 0 10px; font-size: 13px; }
  .info-row { display: flex; gap: 6px; }
  .info-label { font-weight: bold; min-width: 110px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #ccc; padding: 7px 10px; font-size: 13px; }
  th { background: #f5f5f5; font-weight: bold; text-align: center; }
  td.number { text-align: right; font-family: monospace; }
  td.center { text-align: center; }
  .total-row td { font-weight: bold; background: #fafafa; font-size: 14px; }
  .amount-words { padding: 8px 10px; font-size: 13px; background: #fafafa; border: 1px solid #ccc; border-top: 0; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 40px; text-align: center; }
  .sig-box { padding-top: 50px; border-top: 1px solid #333; font-size: 13px; }
  .sig-label { font-size: 11px; color: #666; margin-top: 3px; }
  .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
  .note-box { border: 1px solid #ccc; padding: 8px 10px; font-size: 12px; min-height: 40px; margin-top: 6px; }
</style>
</head>
<body>
  <div class="header">
    <h1>🍈 ระบบล้งทุเรียน</h1>
    <h2>ใบสำคัญจ่าย (Payment Voucher)</h2>
    <h3>จ่ายมัดจำล่วงหน้า / ค่าตัด</h3>
  </div>

  <div class="doc-row">
    <div><strong>เลขที่เอกสาร:</strong> ${item.docNo}</div>
    <div><strong>วันที่:</strong> ${item.date}</div>
    <div><span class="stamp ${item.status}">${statusLabel}</span></div>
  </div>

  <div class="section">
    <div class="section-title">ข้อมูลอ้างอิง</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">อ้างอิงสัญญา:</span>
        <span>${item.contractNo || '-'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">ชื่อสวน:</span>
        <span>${contract?.supplierName || '-'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">สายตัด:</span>
        <span>${item.cuttingTeamName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">มูลค่าสัญญา:</span>
        <span>${contract ? '฿' + fmt(contract.totalValue) : '-'}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">รายละเอียดการจ่ายเงิน</div>
    <table>
      <thead>
        <tr>
          <th style="width:5%">ลำดับ</th>
          <th>สินค้า</th>
          <th>เกรด</th>
          <th style="text-align:right">น้ำหนัก (กก.)</th>
          <th style="text-align:right">ค่าตัด/กก. (บาท)</th>
          <th style="text-align:right">จำนวนเงิน (บาท)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="center">1</td>
          <td>${item.productName}</td>
          <td>${item.gradeName}</td>
          <td class="number">${fmt(item.weight)}</td>
          <td class="number">${fmt(item.cutPricePerKg)}</td>
          <td class="number">${fmt(item.amount)}</td>
        </tr>
        <tr class="total-row">
          <td colspan="5" style="text-align:right;">รวมทั้งสิ้น</td>
          <td class="number">฿${fmt(item.amount)}</td>
        </tr>
      </tbody>
    </table>
    <div class="amount-words">
      <strong>จำนวนเงิน (ตัวอักษร):</strong> ${numberToThaiText(item.amount)}
    </div>
  </div>

  <div class="section">
    <div class="section-title">หมายเหตุ</div>
    <div class="note-box">
      จ่ายมัดจำล่วงหน้าค่าตัดทุเรียน ตามสัญญาเลขที่ ${item.contractNo || '-'}
    </div>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-box">ผู้จ่ายเงิน</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
    <div>
      <div class="sig-box">ผู้รับเงิน</div>
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

export default function AdvancePaymentPage() {
  const [data, setData] = useState<AdvancePayment[]>(mockAdvancePayments);
  const fmt = (n: number) => n.toLocaleString('th-TH');
  const columns: Column<AdvancePayment>[] = [
    { key: 'date', label: 'วันที่' },
    { key: 'docNo', label: 'เลขที่' },
    { key: 'contractNo', label: 'อ้างอิงสัญญา' },
    { key: 'cuttingTeamName', label: 'สายตัด' },
    { key: 'productName', label: 'สินค้า' },
    { key: 'weight', label: 'น้ำหนัก(กก.)', render: (i) => fmt(i.weight) },
    { key: 'amount', label: 'จำนวนเงิน', render: (i) => `฿${fmt(i.amount)}` },
    { key: 'status', label: 'สถานะ', render: (i) => (
      <Badge variant={i.status === 'deducted' ? 'default' : 'secondary'} className="text-[10px]">
        {i.status === 'deducted' ? 'หักแล้ว' : 'รอหัก'}
      </Badge>
    )},
  ];
  return (
    <CrudPage<AdvancePayment>
      title="จ่ายมัดจำล่วงหน้า"
      data={data} columns={columns}
      defaultItem={{ docNo: `AP-2568-${String(data.length + 1).padStart(4, '0')}`, date: new Date().toISOString().split('T')[0], weight: 0, cutPricePerKg: 10, amount: 0, status: 'pending' }}
      onAdd={(item) => {
        const ct = mockCuttingTeams.find((c) => c.id === item.cuttingTeamId);
        const p = mockProducts.find((p) => p.id === item.productId);
        const g = mockGrades.find((g) => g.id === item.gradeId);
        const contract = mockContracts.find((c) => c.id === item.contractId);
        setData([...data, { ...item, id: String(Date.now()), cuttingTeamName: ct?.name || '', productName: p?.name || '', gradeName: g?.name || '', contractNo: contract?.docNo || '', amount: (item.weight || 0) * (item.cutPricePerKg || 0) } as AdvancePayment]);
      }}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? { ...item, amount: item.weight * item.cutPricePerKg } : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      extraActions={(item) => (
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => printVoucher(item)} title="พิมพ์ใบสำคัญจ่าย">
          <Printer className="h-3.5 w-3.5" />
        </Button>
      )}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="วันที่" type="date" value={item.date || ''} onChange={(v) => onChange('date', v)} />
            <FormInput label="เลขที่" value={item.docNo || ''} onChange={(v) => onChange('docNo', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="อ้างอิงสัญญา" value={item.contractId || ''} onChange={(v) => onChange('contractId', v)} options={mockContracts.map((c) => ({ value: c.id, label: c.docNo }))} />
            <FormSelect label="สายตัด" value={item.cuttingTeamId || ''} onChange={(v) => onChange('cuttingTeamId', v)} options={mockCuttingTeams.map((c) => ({ value: c.id, label: c.name }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="สินค้า" value={item.productId || ''} onChange={(v) => onChange('productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
            <FormSelect label="เกรด" value={item.gradeId || ''} onChange={(v) => onChange('gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormInput label="น้ำหนัก(กก.)" type="number" value={String(item.weight || '')} onChange={(v) => onChange('weight', Number(v))} />
            <FormInput label="ค่าตัด/กก." type="number" value={String(item.cutPricePerKg || '')} onChange={(v) => onChange('cutPricePerKg', Number(v))} />
            <div className="pt-5 text-right font-bold">฿{fmt((item.weight || 0) * (item.cutPricePerKg || 0))}</div>
          </div>
        </>
      )}
    />
  );
}
