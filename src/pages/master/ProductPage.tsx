import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Product, mockProducts, mockUnits, mockProductGroups } from '@/data/mockData';

export default function ProductPage() {
  const [data, setData] = useState<Product[]>(mockProducts);
  const columns: Column<Product>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อสินค้า' },
    { key: 'unitName', label: 'หน่วยนับ' },
    { key: 'groupName', label: 'กลุ่มสินค้า' },
  ];
  return (
    <CrudPage<Product>
      title="สินค้า"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '', unitId: '', unitName: '', groupId: '', groupName: '' }}
      onAdd={(item) => {
        const unit = mockUnits.find((u) => u.id === item.unitId);
        const group = mockProductGroups.find((g) => g.id === item.groupId);
        setData([...data, { ...item, id: String(Date.now()), unitName: unit?.name || '', groupName: group?.name || '' } as Product]);
      }}
      onEdit={(item) => {
        const unit = mockUnits.find((u) => u.id === item.unitId);
        const group = mockProductGroups.find((g) => g.id === item.groupId);
        setData(data.map((d) => (d.id === item.id ? { ...item, unitName: unit?.name || item.unitName, groupName: group?.name || item.groupName } : d)));
      }}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสสินค้า" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อสินค้า" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="หน่วยนับ" value={item.unitId || ''} onChange={(v) => onChange('unitId', v)} options={mockUnits.map((u) => ({ value: u.id, label: u.name }))} />
            <FormSelect label="กลุ่มสินค้า" value={item.groupId || ''} onChange={(v) => onChange('groupId', v)} options={mockProductGroups.map((g) => ({ value: g.id, label: g.name }))} />
          </div>
        </>
      )}
    />
  );
}
