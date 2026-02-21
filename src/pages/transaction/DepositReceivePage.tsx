import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { DepositReceive, mockDepositReceives } from '@/data/mockTransactions';
import { mockCustomers, mockProducts, mockGrades, mockBankAccounts } from '@/data/mockData';

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
