import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { ProductGroup, mockProductGroups } from '@/data/mockData';

export default function ProductGroupPage() {
  const [data, setData] = useState<ProductGroup[]>(mockProductGroups);
  const columns: Column<ProductGroup>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อกลุ่มสินค้า' },
  ];
  return (
    <CrudPage<ProductGroup>
      title="กลุ่มสินค้า"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as ProductGroup])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="รหัสกลุ่ม" value={item.code || ''} onChange={(v) => onChange('code', v)} />
          <FormInput label="ชื่อกลุ่ม" value={item.name || ''} onChange={(v) => onChange('name', v)} />
        </div>
      )}
    />
  );
}
