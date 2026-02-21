import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { Department, mockDepartments } from '@/data/mockData';

export default function DepartmentPage() {
  const [data, setData] = useState<Department[]>(mockDepartments);
  const columns: Column<Department>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อแผนก' },
  ];
  return (
    <CrudPage<Department>
      title="แผนก"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Department])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="รหัสแผนก" value={item.code || ''} onChange={(v) => onChange('code', v)} />
          <FormInput label="ชื่อแผนก" value={item.name || ''} onChange={(v) => onChange('name', v)} />
        </div>
      )}
    />
  );
}
