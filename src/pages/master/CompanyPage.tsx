import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { Company, mockCompanies } from '@/data/mockData';

export default function CompanyPage() {
  const [data, setData] = useState<Company[]>(mockCompanies);
  const columns: Column<Company>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อบริษัท' },
    { key: 'taxId', label: 'เลขผู้เสียภาษี' },
    { key: 'phone', label: 'โทร' },
    { key: 'pk7', label: 'พก.7' },
  ];

  return (
    <CrudPage<Company>
      title="บริษัท (ล้ง)"
      data={data}
      columns={columns}
      defaultItem={{ code: '', name: '', taxId: '', address: '', phone: '', pk7: '', doa: '', gap: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as Company])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสบริษัท" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="ชื่อบริษัท" value={item.name || ''} onChange={(v) => onChange('name', v)} />
          </div>
          <FormInput label="เลขผู้เสียภาษี" value={item.taxId || ''} onChange={(v) => onChange('taxId', v)} />
          <FormInput label="ที่อยู่" value={item.address || ''} onChange={(v) => onChange('address', v)} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="โทร" value={item.phone || ''} onChange={(v) => onChange('phone', v)} />
            <FormInput label="พก.7" value={item.pk7 || ''} onChange={(v) => onChange('pk7', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="DOA" value={item.doa || ''} onChange={(v) => onChange('doa', v)} />
            <FormInput label="GAP" value={item.gap || ''} onChange={(v) => onChange('gap', v)} />
          </div>
        </>
      )}
    />
  );
}
