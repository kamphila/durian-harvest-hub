import { useState } from 'react';
import { CrudPage, Column } from '@/components/shared/CrudPage';
import { FormInput } from '@/components/shared/FormField';
import { BankAccount, mockBankAccounts } from '@/data/mockData';

export default function BankAccountPage() {
  const [data, setData] = useState<BankAccount[]>(mockBankAccounts);
  const columns: Column<BankAccount>[] = [
    { key: 'code', label: 'รหัส' },
    { key: 'accountNo', label: 'เลขที่บัญชี' },
    { key: 'name', label: 'ชื่อบัญชี' },
    { key: 'bank', label: 'ธนาคาร' },
  ];
  return (
    <CrudPage<BankAccount>
      title="สมุดบัญชีเงินฝาก"
      data={data} columns={columns}
      defaultItem={{ code: '', accountNo: '', name: '', bank: '' }}
      onAdd={(item) => setData([...data, { ...item, id: String(Date.now()) } as BankAccount])}
      onEdit={(item) => setData(data.map((d) => (d.id === item.id ? item : d)))}
      onDelete={(id) => setData(data.filter((d) => d.id !== id))}
      renderForm={(item, onChange) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="รหัสบัญชี" value={item.code || ''} onChange={(v) => onChange('code', v)} />
            <FormInput label="เลขที่บัญชี" value={item.accountNo || ''} onChange={(v) => onChange('accountNo', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="ชื่อบัญชี" value={item.name || ''} onChange={(v) => onChange('name', v)} />
            <FormInput label="ธนาคาร" value={item.bank || ''} onChange={(v) => onChange('bank', v)} />
          </div>
        </>
      )}
    />
  );
}
