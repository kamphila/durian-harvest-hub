import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { Unit, mockUnits } from '@/data/mockData';

export default function UnitPage() {
  const [data, setData] = useState<Unit[]>(mockUnits);
  const columns: Column<Unit>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อหน่วยนับ' },
    { key: 'boxSize', label: 'ขนาดกล่อง' },
  ];
  return (
    <CrudPage<Unit>
      title="หน่วยนับ"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '', boxSize: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Unit])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสหน่วยนับ" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อหน่วยนับ" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <FormInput label="ขนาดกล่อง" value={item.boxSize || ''} onChange={(v) => onChange('boxSize', v)} />
        </>
      )}
    />
  );
}
