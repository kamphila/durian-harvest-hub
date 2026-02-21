import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Customer, mockCustomers } from '@/data/mockData';

export default function CustomerPage() {
  const [data, setData] = useState<Customer[]>(mockCustomers);
  const columns: Column<Customer>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อลูกค้า' },
    { key: 'type', label: 'ประเภท' },
    { key: 'phone', label: 'โทร' },
  ];
  return (
    <CrudPage<Customer>
      title="ลูกค้า"
      data={data} columns={columns}
      defaultItem={{ code: '', name: '', type: 'บุคคล', taxId: '', address: '', phone: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Customer])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสลูกค้า" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อลูกค้า" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="ประเภท" value={item.type || ''} onChange={(v) => onChange('type', v)} options={[{ value: 'บุคคล', label: 'บุคคล' }, { value: 'นิติบุคคล', label: 'นิติบุคคล' }]} />
            <FormInput label="เลขผู้เสียภาษี" value={item.taxId || ''} onChange={(v) => onChange('taxId', v)} />
          </div>
          <FormInput label="ที่อยู่" value={item.address || ''} onChange={(v) => onChange('address', v)} />
          <FormInput label="โทร" value={item.phone || ''} onChange={(v) => onChange('phone', v)} />
        </>
      )}
    />
  );
}
