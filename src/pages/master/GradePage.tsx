import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { Grade, mockGrades } from '@/data/mockData';

export default function GradePage() {
  const [data, setData] = useState<Grade[]>(mockGrades);
  const columns: Column<Grade>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อเกรด' },
  ];
  return (
    <CrudPage<Grade>
      title="เกรด"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Grade])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="รหัสเกรด" value={item.code || ''} onChange={(v) => onChange('code', v)} />
          <FormInput label="ชื่อเกรด" value={item.name || ''} onChange={(v) => onChange('name', v)} />
        </div>
      )}
    />
  );
}
