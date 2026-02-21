import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Badge } from '@/components/ui/badge';
import { AdvancePayment, mockAdvancePayments, mockContracts } from '@/data/mockTransactions';
import { mockCuttingTeams, mockProducts, mockGrades } from '@/data/mockData';

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
