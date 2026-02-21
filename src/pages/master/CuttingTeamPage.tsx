import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { CuttingTeam, mockCuttingTeams } from '@/data/mockData';

export default function CuttingTeamPage() {
  const [data, setData] = useState<CuttingTeam[]>(mockCuttingTeams);
  const columns: Column<CuttingTeam>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อสายตัด' },
    { key: 'phone', label: 'โทร' },
    { key: 'licensePlate', label: 'ทะเบียนรถ' },
  ];
  return (
    <CrudPage<CuttingTeam>
      title="สายตัด"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '', idCard: '', address: '', phone: '', licensePlate: '', bankAccount: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as CuttingTeam])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสสมาชิก" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อสายตัด" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <FormInput label="เลขบัตรประชาชน" value={item.idCard || ''} onChange={(v) => onChange('idCard', v)} />
          <FormInput label="ที่อยู่" value={item.address || ''} onChange={(v) => onChange('address', v)} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="โทร" value={item.phone || ''} onChange={(v) => onChange('phone', v)} />
            <FormInput label="ทะเบียนรถ" value={item.licensePlate || ''} onChange={(v) => onChange('licensePlate', v)} />
          </div>
          <FormInput label="เลขที่บัญชีธนาคาร" value={item.bankAccount || ''} onChange={(v) => onChange('bankAccount', v)} />
        </>
      )}
    />
  );
}
