import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, UserCog } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockUsers, MockUser } from '@/data/mockUsers';
import { mockCompanies } from '@/data/mockData';
import { ROLE_LABELS, UserRole } from '@/contexts/AuthContext';

export default function UserManagementPage() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [form, setForm] = useState<Partial<MockUser>>({});

  const filtered = users.filter(u =>
    u.name.includes(search) || u.email.includes(search) || u.companyName.includes(search)
  );

  const openAdd = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'purchase', companyId: '', companyName: '', active: true });
    setDialogOpen(true);
  };

  const openEdit = (u: MockUser) => {
    setEditingUser(u);
    setForm({ ...u });
    setDialogOpen(true);
  };

  const handleCompanyChange = (companyId: string) => {
    if (companyId === '_none') {
      setForm(f => ({ ...f, companyId: '', companyName: '(ดูแลทุกบริษัท)' }));
    } else {
      const company = mockCompanies.find(c => c.id === companyId);
      setForm(f => ({ ...f, companyId: company?.code || '', companyName: company?.name || '' }));
    }
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', variant: 'destructive' });
      return;
    }
    if (form.role !== 'admin' && !form.companyId) {
      toast({ title: 'กรุณาเลือกบริษัทที่สังกัด', variant: 'destructive' });
      return;
    }
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...form } as MockUser : u));
      toast({ title: 'แก้ไขผู้ใช้งานสำเร็จ' });
    } else {
      const newUser: MockUser = {
        id: Date.now().toString(),
        name: form.name!,
        email: form.email!,
        role: form.role as UserRole,
        companyId: form.companyId || '',
        companyName: form.companyName || '',
        active: form.active ?? true,
      };
      setUsers(prev => [...prev, newUser]);
      toast({ title: 'เพิ่มผู้ใช้งานสำเร็จ' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: 'ลบผู้ใช้งานสำเร็จ' });
  };

  const roleColor = (role: UserRole) => {
    const colors: Record<string, string> = {
      admin: 'bg-destructive text-destructive-foreground',
      owner: 'bg-primary text-primary-foreground',
      manager: 'bg-info text-info-foreground',
      purchase: 'bg-success text-success-foreground',
      grading: 'bg-warning text-warning-foreground',
      warehouse: 'bg-secondary text-secondary-foreground',
      sales: 'bg-accent text-accent-foreground',
      finance: 'bg-muted text-muted-foreground',
    };
    return colors[role] || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <UserCog className="h-5 w-5" /> จัดการผู้ใช้งาน / Role / ผูกบริษัท
        </h1>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> เพิ่มผู้ใช้</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหาชื่อ, อีเมล, บริษัท..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>บริษัทที่สังกัด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColor(u.role)}>{ROLE_LABELS[u.role]}</Badge>
                  </TableCell>
                  <TableCell>{u.companyName}</TableCell>
                  <TableCell>
                    <Badge variant={u.active ? 'default' : 'secondary'}>
                      {u.active ? 'ใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">ไม่พบข้อมูล</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">ชื่อ-นามสกุล</label>
              <Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">อีเมล</label>
              <Input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">บทบาท (Role)</label>
              <Select value={form.role || ''} onValueChange={v => setForm(f => ({ ...f, role: v as UserRole }))}>
                <SelectTrigger><SelectValue placeholder="เลือกบทบาท" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">บริษัทที่สังกัด (ล้ง)</label>
              <Select
                value={form.companyId ? mockCompanies.find(c => c.code === form.companyId)?.id || '_none' : '_none'}
                onValueChange={handleCompanyChange}
                disabled={form.role === 'admin'}
              >
                <SelectTrigger><SelectValue placeholder="เลือกบริษัท" /></SelectTrigger>
                <SelectContent>
                  {form.role === 'admin' && <SelectItem value="_none">(ดูแลทุกบริษัท)</SelectItem>}
                  {mockCompanies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.role !== 'admin' && (
                <p className="text-xs text-muted-foreground mt-1">* 1 ผู้ใช้งาน สังกัดได้ 1 บริษัทเท่านั้น</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">สถานะ:</label>
              <Button
                type="button"
                size="sm"
                variant={form.active ? 'default' : 'secondary'}
                onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              >
                {form.active ? 'ใช้งาน' : 'ปิดใช้งาน'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
