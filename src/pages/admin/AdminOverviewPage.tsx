import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, UserCog, ShieldCheck } from 'lucide-react';
import { mockCompanies } from '@/data/mockData';
import { mockUsers } from '@/data/mockUsers';
import { ROLE_LABELS } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function AdminOverviewPage() {
  const activeUsers = mockUsers.filter(u => u.active).length;
  const inactiveUsers = mockUsers.filter(u => !u.active).length;

  const companySummary = mockCompanies.map(c => ({
    ...c,
    userCount: mockUsers.filter(u => u.companyId === c.code).length,
  }));

  const roleCounts = mockUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" /> ภาพรวมผู้ดูแลระบบ
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Building2 className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">จำนวนบริษัท</p>
            <p className="text-2xl font-bold">{mockCompanies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Users className="h-6 w-6 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">ผู้ใช้ทั้งหมด</p>
            <p className="text-2xl font-bold">{mockUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <UserCog className="h-6 w-6 mx-auto mb-1 text-info" />
            <p className="text-xs text-muted-foreground">ใช้งานอยู่</p>
            <p className="text-2xl font-bold text-success">{activeUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <UserCog className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">ปิดใช้งาน</p>
            <p className="text-2xl font-bold text-destructive">{inactiveUsers}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ผู้ใช้แยกตามบริษัท</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {companySummary.map(c => (
                <div key={c.id} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="text-sm">{c.name}</span>
                  <Badge variant="secondary">{c.userCount} คน</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ผู้ใช้แยกตาม Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="text-sm">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</span>
                  <Badge variant="outline">{count} คน</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
