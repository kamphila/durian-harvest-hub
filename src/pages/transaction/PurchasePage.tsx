import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Printer, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/shared/FormField';
import { Purchase, PurchaseItem, PurchaseBasket, mockPurchases } from '@/data/mockTransactions';
import { mockSuppliers, mockCuttingTeams, mockProducts, mockGrades, mockBankAccounts } from '@/data/mockData';

export default function PurchasePage() {
  const [data, setData] = useState<Purchase[]>(mockPurchases);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [editItem, setEditItem] = useState<Partial<Purchase>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<PurchaseItem[]>([]);

  const filtered = data.filter((p) =>
    [p.docNo, p.supplierName, p.cuttingTeamName, p.licensePlate]
      .some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditItem({ date: new Date().toISOString().split('T')[0], docNo: `PU-2568-${String(data.length + 1).padStart(4, '0')}`, paymentMethod: 'transfer', deposit: 0 });
    setEditItems([]);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (p: Purchase) => {
    setEditItem({ ...p });
    setEditItems([...p.items]);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const addItem = () => {
    setEditItems([...editItems, { productId: '', productName: '', gradeId: '', gradeName: '', baskets: [{ basketNo: 1, weight: 0 }], totalWeight: 0, pricePerKg: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: keyof PurchaseItem, value: any) => {
    const items = [...editItems];
    (items[idx] as any)[field] = value;
    if (field === 'productId') {
      const p = mockProducts.find((p) => p.id === value);
      items[idx].productName = p?.name || '';
    }
    if (field === 'gradeId') {
      const g = mockGrades.find((g) => g.id === value);
      items[idx].gradeName = g?.name || '';
    }
    items[idx].totalWeight = items[idx].baskets.reduce((s, b) => s + b.weight, 0);
    items[idx].amount = items[idx].totalWeight * items[idx].pricePerKg;
    setEditItems(items);
  };

  const addBasket = (itemIdx: number) => {
    const items = [...editItems];
    items[itemIdx].baskets.push({ basketNo: items[itemIdx].baskets.length + 1, weight: 0 });
    setEditItems(items);
  };

  const updateBasket = (itemIdx: number, basketIdx: number, weight: number) => {
    const items = [...editItems];
    items[itemIdx].baskets[basketIdx].weight = weight;
    items[itemIdx].totalWeight = items[itemIdx].baskets.reduce((s, b) => s + b.weight, 0);
    items[itemIdx].amount = items[itemIdx].totalWeight * items[itemIdx].pricePerKg;
    setEditItems(items);
  };

  const handleSave = () => {
    const totalWeight = editItems.reduce((s, i) => s + i.totalWeight, 0);
    const totalAmount = editItems.reduce((s, i) => s + i.amount, 0);
    const deposit = editItem.deposit || 0;
    const supplier = mockSuppliers.find((s) => s.id === editItem.supplierId);
    const ct = mockCuttingTeams.find((c) => c.id === editItem.cuttingTeamId);

    const purchase: Purchase = {
      id: isEditing ? editItem.id! : String(Date.now()),
      docNo: editItem.docNo || '',
      date: editItem.date || '',
      supplierId: editItem.supplierId || '',
      supplierName: supplier?.name || '',
      cuttingTeamId: editItem.cuttingTeamId || '',
      cuttingTeamName: ct?.name || '',
      licensePlate: editItem.licensePlate || ct?.licensePlate || '',
      items: editItems,
      totalWeight,
      totalAmount,
      deposit,
      netAmount: totalAmount - deposit,
      paymentMethod: editItem.paymentMethod as any || 'cash',
      bankAccountId: editItem.bankAccountId || '',
      status: 'draft',
    };

    if (isEditing) {
      setData(data.map((d) => (d.id === purchase.id ? purchase : d)));
    } else {
      setData([...data, purchase]);
    }
    toast.success(isEditing ? 'แก้ไขเรียบร้อย' : 'เพิ่มเรียบร้อย');
    setDialogOpen(false);
  };

  const fmt = (n: number) => n.toLocaleString('th-TH');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold">รับซื้อ (Purchase Intake)</h1>
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
              <TableHead className="text-xs">ทะเบียนรถ</TableHead>
              <TableHead className="text-xs">สายตัด</TableHead>
              <TableHead className="text-xs">ผู้จำหน่าย</TableHead>
              <TableHead className="text-xs text-right">น้ำหนัก(กก.)</TableHead>
              <TableHead className="text-xs text-right">จำนวนเงิน</TableHead>
              <TableHead className="text-xs text-center">สถานะ</TableHead>
              <TableHead className="text-xs text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p, idx) => (
              <TableRow key={p.id} className="hover:bg-muted/30">
                <TableCell className="text-xs">{idx + 1}</TableCell>
                <TableCell className="text-sm">{p.date}</TableCell>
                <TableCell className="text-sm font-mono">{p.docNo}</TableCell>
                <TableCell className="text-sm">{p.licensePlate}</TableCell>
                <TableCell className="text-sm">{p.cuttingTeamName}</TableCell>
                <TableCell className="text-sm">{p.supplierName}</TableCell>
                <TableCell className="text-sm text-right">{fmt(p.totalWeight)}</TableCell>
                <TableCell className="text-sm text-right font-semibold">฿{fmt(p.netAmount)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className="text-[10px]">
                    {p.status === 'paid' ? 'จ่ายแล้ว' : 'ร่าง'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedPurchase(p); setDetailOpen(true); }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-info" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setData(data.filter((d) => d.id !== p.id)); toast.success('ลบเรียบร้อย'); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}รับซื้อ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormInput label="วันที่" type="date" value={editItem.date || ''} onChange={(v) => setEditItem({ ...editItem, date: v })} />
              <FormInput label="เลขที่เอกสาร" value={editItem.docNo || ''} onChange={(v) => setEditItem({ ...editItem, docNo: v })} />
              <FormSelect label="ผู้จำหน่าย" value={editItem.supplierId || ''} onChange={(v) => setEditItem({ ...editItem, supplierId: v })} options={mockSuppliers.map((s) => ({ value: s.id, label: s.name }))} />
              <FormSelect label="สายตัด" value={editItem.cuttingTeamId || ''} onChange={(v) => {
                const ct = mockCuttingTeams.find((c) => c.id === v);
                setEditItem({ ...editItem, cuttingTeamId: v, licensePlate: ct?.licensePlate || editItem.licensePlate });
              }} options={mockCuttingTeams.map((c) => ({ value: c.id, label: c.name }))} />
              <FormInput label="ทะเบียนรถ" value={editItem.licensePlate || ''} onChange={(v) => setEditItem({ ...editItem, licensePlate: v })} />
            </div>

            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">รายการสินค้า</h3>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> เพิ่มรายการ</Button>
              </div>
              {editItems.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <FormSelect label="สินค้า" value={item.productId} onChange={(v) => updateItem(idx, 'productId', v)} options={mockProducts.map((p) => ({ value: p.id, label: p.name }))} />
                    <FormSelect label="เกรด" value={item.gradeId} onChange={(v) => updateItem(idx, 'gradeId', v)} options={mockGrades.map((g) => ({ value: g.id, label: g.name }))} />
                    <FormInput label="ราคา/กก." type="number" value={String(item.pricePerKg)} onChange={(v) => updateItem(idx, 'pricePerKg', Number(v))} />
                    <div className="text-right pt-5">
                      <span className="text-xs text-muted-foreground">น้ำหนัก: </span>
                      <span className="font-bold">{item.totalWeight} กก.</span>
                      <span className="text-xs text-muted-foreground ml-2">= ฿{fmt(item.amount)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">เข่ง:</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => addBasket(idx)}>+ เข่ง</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.baskets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">#{b.basketNo}</span>
                          <Input type="number" className="w-20 h-7 text-sm" value={b.weight || ''} onChange={(e) => updateBasket(idx, bIdx, Number(e.target.value))} placeholder="กก." />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormInput label="หักมัดจำ" type="number" value={String(editItem.deposit || 0)} onChange={(v) => setEditItem({ ...editItem, deposit: Number(v) })} />
              <FormSelect label="ชำระโดย" value={editItem.paymentMethod || ''} onChange={(v) => setEditItem({ ...editItem, paymentMethod: v as any })} options={[{ value: 'cash', label: 'เงินสด' }, { value: 'transfer', label: 'โอน' }]} />
              {editItem.paymentMethod === 'transfer' && (
                <FormSelect label="บัญชี" value={editItem.bankAccountId || ''} onChange={(v) => setEditItem({ ...editItem, bankAccountId: v })} options={mockBankAccounts.map((b) => ({ value: b.id, label: `${b.bank} - ${b.accountNo}` }))} />
              )}
            </div>

            <div className="bg-muted/50 rounded-md p-3 text-right space-y-1">
              <p className="text-sm">น้ำหนักรวม: <strong>{editItems.reduce((s, i) => s + i.totalWeight, 0)} กก.</strong></p>
              <p className="text-sm">รวมเงิน: <strong>฿{fmt(editItems.reduce((s, i) => s + i.amount, 0))}</strong></p>
              <p className="text-sm">หักมัดจำ: <strong>฿{fmt(editItem.deposit || 0)}</strong></p>
              <p className="text-base font-bold text-primary">ยอดสุทธิ: ฿{fmt(editItems.reduce((s, i) => s + i.amount, 0) - (editItem.deposit || 0))}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ใบรับซื้อ {selectedPurchase?.docNo}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-muted-foreground">วันที่:</span> {selectedPurchase.date}</p>
                <p><span className="text-muted-foreground">ผู้จำหน่าย:</span> {selectedPurchase.supplierName}</p>
                <p><span className="text-muted-foreground">สายตัด:</span> {selectedPurchase.cuttingTeamName}</p>
                <p><span className="text-muted-foreground">ทะเบียน:</span> {selectedPurchase.licensePlate}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">สินค้า</TableHead>
                    <TableHead className="text-xs">เกรด</TableHead>
                    <TableHead className="text-xs text-right">น้ำหนัก</TableHead>
                    <TableHead className="text-xs text-right">ราคา/กก.</TableHead>
                    <TableHead className="text-xs text-right">จำนวนเงิน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchase.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.gradeName}</TableCell>
                      <TableCell className="text-right">{fmt(item.totalWeight)} กก.</TableCell>
                      <TableCell className="text-right">฿{fmt(item.pricePerKg)}</TableCell>
                      <TableCell className="text-right font-semibold">฿{fmt(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right space-y-1 border-t pt-2">
                <p>รวม: ฿{fmt(selectedPurchase.totalAmount)}</p>
                <p>หักมัดจำ: ฿{fmt(selectedPurchase.deposit)}</p>
                <p className="text-lg font-bold text-primary">สุทธิ: ฿{fmt(selectedPurchase.netAmount)}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => toast.info('พิมพ์ใบจ่ายเงิน...')}><Printer className="h-4 w-4 mr-1" /> พิมพ์ใบจ่ายเงิน</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
