import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { DepositReceive, mockDepositReceives } from '@/data/mockTransactions';
import { mockCustomers, mockProducts, mockGrades, mockBankAccounts } from '@/data/mockData';

function numberToThaiText(n: number): string {
  const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  if (n === 0) return 'ศูนย์บาทถ้วน';
  const intPart = Math.floor(n);
  const decPart = Math.round((n - intPart) * 100);
  function convertInt(num: number): string {
    if (num === 0) return '';
    const str = String(num);
    let result = '';
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(str[i]);
      const pos = len - i - 1;
      if (digit === 0) continue;
      if (pos === 1 && digit === 1) { result += 'สิบ'; continue; }
      if (pos === 1 && digit === 2) { result += 'ยี่สิบ'; continue; }
      if (pos === 0 && digit === 1 && len > 1) { result += 'เอ็ด'; continue; }
      result += units[digit] + positions[pos];
    }
    return result;
  }
  let text = convertInt(intPart) + 'บาท';
  if (decPart > 0) { text += convertInt(decPart) + 'สตางค์'; } else { text += 'ถ้วน'; }
  return text;
}

function printReceipt(item: DepositReceive) {
  const bank = mockBankAccounts.find(b => b.id === item.bankAccountId);
  const statusLabel = item.status === 'used' ? 'ใช้แล้ว' : 'รอใช้';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ใบเสร็จรับเงิน ${item.docNo}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Noto Sans Thai', sans-serif; font-size: 13px; color: #1a1a1a; padding: 20px; }
  .receipt { max-width: 700px; margin: 0 auto; border: 2px solid #333; padding: 30px; }
  .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .header h2 { font-size: 16px; color: #555; }
  .doc-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
  .doc-info div { line-height: 1.8; }
  .status-badge { display: inline-block; padding: 2px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; color: #fff; background: ${item.status === 'used' ? '#16a34a' : '#f59e0b'}; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { border: 1px solid #999; padding: 8px 10px; text-align: left; }
  th { background: #f3f4f6; font-weight: bold; font-size: 12px; }
  td { font-size: 13px; }
  .text-right { text-align: right; }
  .total-row { background: #f9fafb; font-weight: bold; font-size: 14px; }
  .thai-text { background: #fffbeb; padding: 8px 12px; border: 1px dashed #d97706; border-radius: 6px; margin: 10px 0; font-size: 13px; }
  .payment-info { margin: 15px 0; padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; }
  .payment-info p { line-height: 1.8; }
  .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
  .sig-box { text-align: center; width: 200px; }
  .sig-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; }
  .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
</style></head><body>
<div class="receipt">
  <div class="header">
    <h1>ใบเสร็จรับเงินมัดจำ</h1>
    <h2>Deposit Receipt</h2>
  </div>
  <div class="doc-info">
    <div>
      <p><strong>เลขที่:</strong> ${item.docNo}</p>
      <p><strong>วันที่:</strong> ${item.date}</p>
      <p><strong>สถานะ:</strong> <span class="status-badge">${statusLabel}</span></p>
    </div>
    <div style="text-align:right">
      <p><strong>ลูกค้า:</strong> ${item.customerName}</p>
      <p><strong>อ้างอิงสัญญา:</strong> ${item.contractRef || '-'}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>รายการ</th><th>สินค้า</th><th>เกรด</th><th class="text-right">จำนวน</th><th class="text-right">จำนวนเงิน (บาท)</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>ค่ามัดจำล่วงหน้า</td>
        <td>${item.productName}</td>
        <td>${item.gradeName}</td>
        <td class="text-right">${item.quantity.toLocaleString('th-TH')}</td>
        <td class="text-right">${item.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr class="total-row">
        <td colspan="4" class="text-right">รวมทั้งสิ้น</td>
        <td class="text-right">${item.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>
  <div class="thai-text">
    <strong>จำนวนเงิน (ตัวอักษร):</strong> ${numberToThaiText(item.amount)}
  </div>
  <div class="payment-info">
    <p><strong>ชำระโดย:</strong> โอนเงิน</p>
    <p><strong>บัญชีรับ:</strong> ${bank ? `${bank.bank} - ${bank.accountNo}` : '-'}</p>
  </div>
  <div class="signatures">
    <div class="sig-box"><div class="sig-line">ผู้รับเงิน</div></div>
    <div class="sig-box"><div class="sig-line">ผู้จ่ายเงิน</div></div>
    <div class="sig-box"><div class="sig-line">ผู้อนุมัติ</div></div>
  </div>
  <div class="footer">เอกสารนี้ออกโดยระบบอัตโนมัติ • พิมพ์วันที่ ${new Date().toLocaleDateString('th-TH')}</div>
</div>
</body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);
  iframe.contentDocument?.open();
  iframe.contentDocument?.write(html);
  iframe.contentDocument?.close();
  iframe.onload = () => { iframe.contentWindow?.print(); setTimeout(() => document.body.removeChild(iframe), 1000); };
}

export default function DepositReceivePage() {
  const [data, setData] = useState<DepositReceive[]>(mockDepositReceives);
  const fmt = (n: number) => n.toLocaleString('th-TH');
  const columns: Column<DepositReceive>[] = [
    { key: 'date', label: 'วันที่' },
    { key: 'docNo', label: 'เลขที่' },
    { key: 'customerName', label: 'ลูกค้า' },
    { key: 'contractRef', label: 'อ้างอิงสัญญา' },
    { key: 'productName', label: 'สินค้า' },
    { key: 'quantity', label: 'จำนวน' },
    { key: 'amount', label: 'จำนวนเงิน', render: (i) => `฿${fmt(i.amount)}` },
    { key: 'status', label: 'สถานะ', render: (i) => <Badge variant={i.status === 'used' ? 'default' : 'secondary'} className="text-[10px]">{i.status === 'used' ? 'ใช้แล้ว' : 'รอใช้'}</Badge> },
  ];
  return (
    <CrudPage<DepositReceive>
      title="รับมัดจำล่วงหน้า (จากลูกค้า)"
      data={data} columns={columns}
      defaultItem={{ docNo: `DR-2568-${String(data.length + 1).padStart(4, '0')}`, date: new Date().toISOString().split('T')[0], quantity: 0, amount: 0, paymentMethod: 'transfer', status: 'received' }}
      onAdd={(item) => {
        const c = mockCustomers.find((c) => c.id === item.customerId);
        const p = mockProducts.find((p) => p.id === item.productId);
        const g = mockGrades.find((g) => g.id === item.gradeId);
        setData([...data, { ...item, id: String(Date.now()), customerName: c?.name || '', productName: p?.name || '', gradeName: g?.name || '' } as DepositReceive]);
      }}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      extraActions={(item) => (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => printReceipt(item)} title="พิมพ์ใบเสร็จ">
          <FileText className="h-4 w-4" />
        </Button>
      )}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="วันที่" type="date" value={item.date || ''} onChange={(v) => onChange('date', v)} />
            <FormInput label="เลขที่" value={item.docNo || ''} onChange={(v) => onChange('docNo', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="ลูกค้า" value={item.customerId || ''} onChange={(v) => onChange('customerId', v)} options={mockCustomers.map((c) => ({ value: c.id, label: c.name }))} />
            <FormInput label="อ้างอิงสัญญา" value={item.contractRef || ''} onChange={(v) => onChange('contractRef', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="สินค้า" value={item.productId || ''} onChange={(v) => onChange('productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
            <FormSelect label="เกรด" value={item.gradeId || ''} onChange={(v) => onChange('gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="จำนวน" type="number" value={String(item.quantity || '')} onChange={(v) => onChange('quantity', Number(v))} />
            <FormInput label="จำนวนเงิน" type="number" value={String(item.amount || '')} onChange={(v) => onChange('amount', Number(v))} />
          </div>
          <FormSelect label="บัญชีรับ" value={item.bankAccountId || ''} onChange={(v) => onChange('bankAccountId', v)} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
        </>
      )}
    />
  );
}
