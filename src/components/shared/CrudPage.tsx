import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface CrudPageProps<T extends { id: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd: (item: Omit<T, 'id'>) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderForm: (item: Partial<T>, onChange: (field: keyof T, value: any) => void) => ReactNode;
  defaultItem: Partial<T>;
  extraActions?: (item: T) => ReactNode;
}

export function CrudPage<T extends { id: string }>({
  title, data, columns, onAdd, onEdit, onDelete, renderForm, defaultItem, extraActions,
}: CrudPageProps<T>) {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<T> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = data.filter((item) =>
    columns.some((col) => {
      const val = (item as any)[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    })
  );

  const openAdd = () => { setEditItem({ ...defaultItem }); setIsEditing(false); setDialogOpen(true); };
  const openEdit = (item: T) => { setEditItem({ ...item }); setIsEditing(true); setDialogOpen(true); };

  const handleSave = () => {
    if (!editItem) return;
    if (isEditing) {
      onEdit(editItem as T);
      toast.success('แก้ไขข้อมูลเรียบร้อย');
    } else {
      onAdd(editItem as Omit<T, 'id'>);
      toast.success('เพิ่มข้อมูลเรียบร้อย');
    }
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('ลบข้อมูลเรียบร้อย');
  };

  const handleChange = (field: keyof T, value: any) => {
    setEditItem((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button onClick={openAdd} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-1" /> เพิ่ม
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="text-xs font-semibold">{col.label}</TableHead>
              ))}
              <TableHead className="w-24 text-center text-xs font-semibold">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground py-8">ไม่พบข้อมูล</TableCell></TableRow>
            ) : (
              filtered.map((item, idx) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="text-sm">
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {extraActions && extraActions(item)}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-info hover:text-info" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">แสดง {filtered.length} รายการ จากทั้งหมด {data.length} รายการ</p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {editItem && renderForm(editItem, handleChange)}
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
