import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { Branch, mockBranches } from '@/data/mockData';

export default function BranchPage() {
  const [data, setData] = useState<Branch[]>(mockBranches);
  const columns: Column<Branch>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อสาขา' },
    { key: 'address', label: 'ที่อยู่' },
    { key: 'phone', label: 'โทร' },
  ];
  return (
    <CrudPage<Branch>
      title="สาขา"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '', address: '', phone: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Branch])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสสาขา" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อสาขา" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <FormInput label="ที่อยู่" value={item.address || ''} onChange={(v) => onChange('address', v)} />
          <FormInput label="โทร" value={item.phone || ''} onChange={(v) => onChange('phone', v)} />
        </>
      )}
    />
  );
}
