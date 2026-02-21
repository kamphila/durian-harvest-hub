import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contract, mockContracts } from '@/data/mockTransactions';
import { mockSuppliers, mockBankAccounts } from '@/data/mockData';
import { Printer } from 'lucide-react';

function printContract(contract: Contract) {
  const supplier = mockSuppliers.find(s => s.id === contract.supplierId);
  const bank = mockBankAccounts.find(b => b.id === contract.bankAccountId);
  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  const statusLabel = contract.status === 'completed' ? 'เสร็จสิ้น' : contract.status === 'active' ? 'ดำเนินการ' : 'ยกเลิก';
  const paymentLabel = contract.paymentMethod === 'cash' ? 'เงินสด' : 'โอนเงิน';

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>สัญญาซื้อเหมาสวน ${contract.docNo}</title>
<style>
  @media print { @page { size: A4; margin: 15mm 20mm; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Sarabun', 'Tahoma', sans-serif; font-size: 14px; color: #1a1a1a; padding: 20px; }
  .header { text-align: center; margin-bottom: 24px; border-bottom: 3px double #333; padding-bottom: 16px; }
  .header h1 { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .header h2 { font-size: 16px; font-weight: normal; color: #555; }
  .doc-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 14px; font-weight: bold; background: #f0f0f0; padding: 6px 10px; margin-bottom: 8px; border-left: 4px solid #333; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; padding: 0 10px; }
  .info-row { display: flex; gap: 8px; }
  .info-label { font-weight: bold; min-width: 120px; color: #555; }
  .info-value { flex: 1; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; font-size: 13px; }
  th { background: #f5f5f5; font-weight: bold; }
  td.number { text-align: right; font-family: monospace; }
  .total-row td { font-weight: bold; background: #fafafa; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 50px; text-align: center; }
  .sig-box { padding-top: 60px; border-top: 1px solid #333; }
  .sig-label { font-size: 12px; color: #666; margin-top: 4px; }
  .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
  .stamp { display: inline-block; border: 2px solid; padding: 4px 16px; font-size: 14px; font-weight: bold; transform: rotate(-5deg); margin-left: 16px; }
  .stamp.active { border-color: #2563eb; color: #2563eb; }
  .stamp.completed { border-color: #16a34a; color: #16a34a; }
  .stamp.cancelled { border-color: #dc2626; color: #dc2626; }
</style>
</head>
<body>
  <div class="header">
    <h1>🍈 ระบบล้งทุเรียน</h1>
    <h2>สัญญาซื้อเหมาสวน (Contract)</h2>
  </div>

  <div class="doc-info">
    <div><strong>เลขที่สัญญา:</strong> ${contract.docNo}</div>
    <div><strong>วันที่ทำสัญญา:</strong> ${contract.date}</div>
    <div>
      <span class="stamp ${contract.status}">${statusLabel}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">ข้อมูลคู่สัญญา</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">ชื่อสวน/ผู้จำหน่าย:</span>
        <span class="info-value">${contract.supplierName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">รหัสผู้จำหน่าย:</span>
        <span class="info-value">${contract.supplierId || '-'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">ที่อยู่สวน:</span>
        <span class="info-value">${supplier?.address || '-'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">เบอร์โทร:</span>
        <span class="info-value">${supplier?.phone || '-'}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">รายละเอียดสัญญา</div>
    <table>
      <thead>
        <tr>
          <th>รายการ</th>
          <th style="text-align:right;">จำนวนเงิน (บาท)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>มูลค่าเหมาสวนทั้งหมด</td>
          <td class="number">฿${fmt(contract.totalValue)}</td>
        </tr>
        <tr>
          <td>ยอดจ่ายแล้ว</td>
          <td class="number">฿${fmt(contract.paidAmount)}</td>
        </tr>
        <tr class="total-row">
          <td>ยอมคงเหลือ</td>
          <td class="number">฿${fmt(contract.remainingAmount)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">การชำระเงิน</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">วิธีชำระเงิน:</span>
        <span class="info-value">${paymentLabel}</span>
      </div>
      <div class="info-row">
        <span class="info-label">บัญชีธนาคาร:</span>
        <span class="info-value">${bank ? bank.bank + ' - ' + bank.accountNo + ' (' + bank.name + ')' : '-'}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">เงื่อนไขสัญญา</div>
    <div style="padding: 8px 10px; font-size: 13px; line-height: 1.8;">
      <p>1. ผู้ซื้อตกลงซื้อเหมาผลผลิตทุเรียนทั้งหมดจากสวนของผู้ขาย ในราคารวม <strong>฿${fmt(contract.totalValue)}</strong></p>
      <p>2. ผู้ซื้อจะชำระเงินให้ผู้ขายตามงวดที่ตกลงกัน โดยวิธี${paymentLabel}</p>
      <p>3. ผู้ขายจะส่งมอบผลผลิตทุเรียนที่ได้คุณภาพตามมาตรฐานที่ผู้ซื้อกำหนด</p>
      <p>4. กรณีผลผลิตไม่ได้คุณภาพ ผู้ซื้อมีสิทธิ์ปฏิเสธการรับซื้อในส่วนนั้น</p>
      <p>5. สัญญานี้มีผลบังคับใช้ตั้งแต่วันที่ลงนาม จนกว่าจะส่งมอบผลผลิตครบถ้วนและชำระเงินเสร็จสิ้น</p>
    </div>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-box">ผู้ซื้อ (ล้ง)</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
    <div>
      <div class="sig-box">ผู้ขาย (เจ้าของสวน)</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
    <div>
      <div class="sig-box">พยาน</div>
      <div class="sig-label">วันที่ ____/____/____</div>
    </div>
  </div>

  <div class="footer">
    เอกสารนี้พิมพ์จากระบบล้งทุเรียน — พิมพ์เมื่อ ${new Date().toLocaleString('th-TH')}
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  }
}

export default function ContractPage() {
  const [data, setData] = useState<Contract[]>(mockContracts);
  const fmt = (n: number) => n.toLocaleString('th-TH');
  const columns: Column<Contract>[] = [
    { key: 'date', label: 'วันที่' },
    { key: 'docNo', label: 'เลขที่' },
    { key: 'supplierName', label: 'ชื่อสวน' },
    { key: 'totalValue', label: 'มูลค่าเหมา', render: (i) => `฿${fmt(i.totalValue)}` },
    { key: 'paidAmount', label: 'จ่ายแล้ว', render: (i) => `฿${fmt(i.paidAmount)}` },
    { key: 'remainingAmount', label: 'คงเหลือ', render: (i) => `฿${fmt(i.remainingAmount)}` },
    { key: 'status', label: 'สถานะ', render: (i) => (
      <Badge variant={i.status === 'completed' ? 'default' : i.status === 'active' ? 'secondary' : 'destructive'} className="text-[10px]">
        {i.status === 'completed' ? 'เสร็จสิ้น' : i.status === 'active' ? 'ดำเนินการ' : 'ยกเลิก'}
      </Badge>
    )},
  ];
  return (
    <CrudPage<Contract>
      title="สัญญาซื้อเหมาสวน"
      data={data} columns={columns}
      defaultItem={{ docNo: `CT-2568-${String(data.length + 1).padStart(4, '0')}`, date: new Date().toISOString().split('T')[0], totalValue: 0, paidAmount: 0, remainingAmount: 0, paymentMethod: 'transfer', status: 'active' }}
      onAdd={(item) => {
        const s = mockSuppliers.find((s) => s.id === item.supplierId);
        setData([...data, { ...item, id: String(Date.now()), supplierName: s?.name || '', remainingAmount: (item.totalValue || 0) - (item.paidAmount || 0) } as Contract]);
      }}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? { ...item, remainingAmount: item.totalValue - item.paidAmount } : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      extraActions={(item) => (
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => printContract(item)} title="พิมพ์สัญญา">
          <Printer className="h-3.5 w-3.5" />
        </Button>
      )}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="วันที่" type="date" value={item.date || ''} onChange={(v) => onChange('date', v)} />
            <FormInput label="เลขที่" value={item.docNo || ''} onChange={(v) => onChange('docNo', v)} />
          </div>
          <FormSelect label="ชื่อสวน" value={item.supplierId || ''} onChange={(v) => onChange('supplierId', v)} options={mockSuppliers.map((s) => ({ value: s.id, label: s.name }))} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="มูลค่าเหมา" type="number" value={String(item.totalValue || '')} onChange={(v) => onChange('totalValue', Number(v))} />
            <FormInput label="จ่ายแล้ว" type="number" value={String(item.paidAmount || '')} onChange={(v) => onChange('paidAmount', Number(v))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="ชำระโดย" value={item.paymentMethod || ''} onChange={(v) => onChange('paymentMethod', v)} options={[{ value: 'cash', label: 'เงินสด' }, { value: 'transfer', label: 'โอน' }]} />
            <FormSelect label="บัญชี" value={item.bankAccountId || ''} onChange={(v) => onChange('bankAccountId', v)} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
          </div>
        </>
      )}
    />
  );
}
