import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Sales, SalesItem, mockSales } from '@/data/mockTransactions';
import { mockCustomers, mockProducts, mockGrades, mockUnits, mockBankAccounts } from '@/data/mockData';

export default function SalesPage() {
  const [data, setData] = useState<Sales[]>(mockSales);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Sales>>({});
  const [editItems, setEditItems] = useState<SalesItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = data.filter((s) => [s.docNo, s.containerNo, s.customerName].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  const fmt = (n: number) => n.toLocaleString('th-TH');

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    preparing: { label: 'เตรียมของ', variant: 'secondary' },
    loading: { label: 'กำลังโหลด', variant: 'outline' },
    exported: { label: 'ส่งออกแล้ว', variant: 'default' },
    paid: { label: 'รับเงินแล้ว', variant: 'default' },
  };

  const openAdd = () => {
    setEditItem({ date: new Date().toISOString().split('T')[0], docNo: `SL-2568-${String(data.length + 1).padStart(4, '0')}`, deposit: 0, paymentMethod: 'transfer' });
    setEditItems([]);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const addItem = () => {
    setEditItems([...editItems, { productId: '', productName: '', gradeId: '', gradeName: '', quantity: 0, unitId: '', unitName: '', pricePerUnit: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: keyof SalesItem, value: any) => {
    const items = [...editItems];
    (items[idx] as any)[field] = value;
    if (field === 'productId') items[idx].productName = mockProducts.find((p) => p.id === value)?.name || '';
    if (field === 'gradeId') items[idx].gradeName = mockGrades.find((g) => g.id === value)?.name || '';
    if (field === 'unitId') items[idx].unitName = mockUnits.find((u) => u.id === value)?.name || '';
    items[idx].amount = items[idx].quantity * items[idx].pricePerUnit;
    setEditItems(items);
  };

  const handleSave = () => {
    const totalAmount = editItems.reduce((s, i) => s + i.amount, 0);
    const customer = mockCustomers.find((c) => c.id === editItem.customerId);
    const sale: Sales = {
      id: isEditing ? editItem.id! : String(Date.now()),
      docNo: editItem.docNo || '', date: editItem.date || '', containerNo: editItem.containerNo || '',
      customerId: editItem.customerId || '', customerName: customer?.name || '',
      items: editItems, totalAmount, deposit: editItem.deposit || 0, netAmount: totalAmount - (editItem.deposit || 0),
      paymentMethod: editItem.paymentMethod as any || 'transfer', bankAccountId: editItem.bankAccountId || '',
      sampleDate: editItem.sampleDate || '', sampleCollector: editItem.sampleCollector || '',
      status: 'preparing',
    };
    if (isEditing) setData(data.map((d) => (d.id === sale.id ? sale : d)));
    else setData([...data, sale]);
    toast.success('บันทึกเรียบร้อย');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold">ขาย/ส่งออก (Sales/Export)</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> เพิ่ม</Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">#</TableHead>
              <TableHead className="text-xs">วันที่</TableHead>
              <TableHead className="text-xs">เลขที่</TableHead>
              <TableHead className="text-xs">เลขตู้</TableHead>
              <TableHead className="text-xs">ลูกค้า</TableHead>
              <TableHead className="text-xs text-right">มูลค่า</TableHead>
              <TableHead className="text-xs text-center">สถานะ</TableHead>
              <TableHead className="text-xs text-center">เอกสาร</TableHead>
              <TableHead className="text-xs text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, idx) => (
              <TableRow key={s.id} className="hover:bg-muted/30">
                <TableCell className="text-xs">{idx + 1}</TableCell>
                <TableCell className="text-sm">{s.date}</TableCell>
                <TableCell className="text-sm font-mono">{s.docNo}</TableCell>
                <TableCell className="text-sm font-mono">{s.containerNo}</TableCell>
                <TableCell className="text-sm">{s.customerName}</TableCell>
                <TableCell className="text-sm text-right font-semibold">฿{fmt(s.netAmount)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={statusMap[s.status]?.variant || 'secondary'} className="text-[10px]">
                    {statusMap[s.status]?.label || s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {['Invoice', 'PackList', 'GAP'].map((doc) => (
                      <Button key={doc} variant="ghost" size="sm" className="h-6 text-[10px] px-1" onClick={() => toast.info(`พิมพ์ ${doc}...`)}>
                        <FileText className="h-3 w-3 mr-0.5" />{doc}
                      </Button>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-info" onClick={() => { setEditItem({ ...s }); setEditItems([...s.items]); setIsEditing(true); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setData(data.filter((d) => d.id !== s.id)); toast.success('ลบเรียบร้อย'); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}ขาย/ส่งออก</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="วันที่" type="date" value={editItem.date || ''} onChange={(v) => setEditItem({ ...editItem, date: v })} />
              <FormInput label="เลขที่" value={editItem.docNo || ''} onChange={(v) => setEditItem({ ...editItem, docNo: v })} />
              <FormInput label="เลขตู้ Container" value={editItem.containerNo || ''} onChange={(v) => setEditItem({ ...editItem, containerNo: v })} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormSelect label="ลูกค้า" value={editItem.customerId || ''} onChange={(v) => setEditItem({ ...editItem, customerId: v })} options={mockCustomers.map((c) => ({ value: c.id, label: c.name }))} />
              <FormInput label="วันที่สุ่มตัวอย่าง" type="date" value={editItem.sampleDate || ''} onChange={(v) => setEditItem({ ...editItem, sampleDate: v })} />
              <FormInput label="ผู้ส่งเก็บตัวอย่าง" value={editItem.sampleCollector || ''} onChange={(v) => setEditItem({ ...editItem, sampleCollector: v })} />
            </div>

            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">รายการสินค้า</h3>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> เพิ่มรายการ</Button>
              </div>
              {editItems.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <FormSelect label="สินค้า" value={item.productId} onChange={(v) => updateItem(idx, 'productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
                    <FormSelect label="เกรด" value={item.gradeId} onChange={(v) => updateItem(idx, 'gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
                    <FormInput label="จำนวน" type="number" value={String(item.quantity)} onChange={(v) => updateItem(idx, 'quantity', Number(v))} />
                    <FormSelect label="หน่วย" value={item.unitId} onChange={(v) => updateItem(idx, 'unitId', v)} options={mockUnits.map((u) => ({ value: u.id, label: u.name }))} />
                    <FormInput label="ราคา/หน่วย" type="number" value={String(item.pricePerUnit)} onChange={(v) => updateItem(idx, 'pricePerUnit', Number(v))} />
                  </div>
                  <p className="text-right text-sm mt-1 font-semibold">= ฿{fmt(item.quantity * item.pricePerUnit)}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="หักมัดจำ" type="number" value={String(editItem.deposit || 0)} onChange={(v) => setEditItem({ ...editItem, deposit: Number(v) })} />
              <FormSelect label="รับชำระโดย" value={editItem.paymentMethod || ''} onChange={(v) => setEditItem({ ...editItem, paymentMethod: v as any })} options={[{ value: 'deposit-deduct', label: 'หักมัดจำ' }, { value: 'transfer', label: 'โอน' }]} />
              <FormSelect label="บัญชี" value={editItem.bankAccountId || ''} onChange={(v) => setEditItem({ ...editItem, bankAccountId: v })} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
            </div>

            <div className="bg-muted/50 rounded-md p-3 text-right">
              <p className="text-base font-bold text-primary">ยอดสุทธิ: ฿{fmt(editItems.reduce((s, i) => s + i.amount, 0) - (editItem.deposit || 0))}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
