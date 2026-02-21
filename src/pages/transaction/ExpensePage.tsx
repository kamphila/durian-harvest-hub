import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Expense, mockExpenses } from '@/data/mockTransactions';
import { mockBankAccounts } from '@/data/mockData';

export default function ExpensePage() {
  const [data, setData] = useState<Expense[]>(mockExpenses);
  const fmt = (n: number) => n.toLocaleString('th-TH');
  const columns: Column<Expense>[] = [
    { key: 'date', label: 'วันที่' },
    { key: 'docNo', label: 'เลขที่' },
    { key: 'supplierName', label: 'ผู้จำหน่าย' },
    { key: 'description', label: 'รายละเอียด' },
    { key: 'amount', label: 'จำนวนเงิน', render: (i) => `฿${fmt(i.amount)}` },
    { key: 'status', label: 'สถานะ', render: (i) => <Badge variant={i.status === 'paid' ? 'default' : 'secondary'} className="text-[10px]">{i.status === 'paid' ? 'จ่ายแล้ว' : 'บันทึก'}</Badge> },
  ];
  return (
    <div className="space-y-4">
      <CrudPage<Expense>
        title="บันทึกค่าใช้จ่าย"
        data={data} columns={columns}
        defaultItem={{ docNo: `EX-2568-${String(data.length + 1).padStart(4, '0')}`, date: new Date().toISOString().split('T')[0], quantity: 0, pricePerUnit: 0, amount: 0, paymentMethod: 'cash', status: 'recorded' }}
        onAdd={(item) => setData([...data, { ...item, id: String(Date.now()), amount: (item.quantity || 0) * (item.pricePerUnit || 0) } as Expense])}
        onEdit={(item) => setData(data.map((d) => (d.id === item.id ? { ...item, amount: item.quantity * item.pricePerUnit } : d)))}
        onDelete={(id) => setData(data.filter((d) => d.id !== id))}
        renderForm={(item, onChange) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="วันที่" type="date" value={item.date || ''} onChange={(v) => onChange('date', v)} />
              <FormInput label="เลขที่" value={item.docNo || ''} onChange={(v) => onChange('docNo', v)} />
            </div>
            <FormInput label="ผู้จำหน่าย/รายการ" value={item.supplierName || ''} onChange={(v) => onChange('supplierName', v)} />
            <FormInput label="รายละเอียด" value={item.description || ''} onChange={(v) => onChange('description', v)} />
            <div className="grid grid-cols-3 gap-3">
              <FormInput label="จำนวน" type="number" value={String(item.quantity || '')} onChange={(v) => onChange('quantity', Number(v))} />
              <FormInput label="หน่วย" value={item.unitName || ''} onChange={(v) => onChange('unitName', v)} />
              <FormInput label="ราคา/หน่วย" type="number" value={String(item.pricePerUnit || '')} onChange={(v) => onChange('pricePerUnit', Number(v))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormSelect label="ชำระโดย" value={item.paymentMethod || ''} onChange={(v) => onChange('paymentMethod', v)} options={[{ value: 'cash', label: 'เงินสด' }, { value: 'transfer', label: 'โอน' }]} />
              {item.paymentMethod === 'transfer' && (
                <FormSelect label="บัญชี" value={item.bankAccountId || ''} onChange={(v) => onChange('bankAccountId', v)} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
              )}
            </div>
            <div className="text-right font-bold text-lg">รวม: ฿{fmt((item.quantity || 0) * (item.pricePerUnit || 0))}</div>
          </>
        )}
      />
    </div>
  );
}
