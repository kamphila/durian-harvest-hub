import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { Contract, mockContracts } from '@/data/mockTransactions';
import { mockSuppliers, mockBankAccounts } from '@/data/mockData';

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
