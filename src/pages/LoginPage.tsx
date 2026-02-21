import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const DEMO_ACCOUNTS = [
  { email: 'admin@durian.com', password: '1234', role: 'ผู้ดูแลระบบ', desc: 'เห็นเมนูจัดการผู้ใช้/บริษัท' },
  { email: 'owner@durian.com', password: '1234', role: 'เจ้าของล้ง', desc: 'เห็นเมนูทั้งหมดของบริษัท' },
  { email: 'purchase@durian.com', password: '1234', role: 'ฝ่ายรับซื้อ', desc: 'เห็นเฉพาะเอกสาร' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const attemptLogin = (loginEmail: string, loginPassword: string) => {
    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setError(result.error || 'เข้าสู่ระบบไม่สำเร็จ');
      toast({ title: 'เข้าสู่ระบบไม่สำเร็จ', description: result.error, variant: 'destructive' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    attemptLogin(email, password);
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('1234');
    setError('');
    attemptLogin(demoEmail, '1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="text-5xl mb-2">🍈</div>
          <h1 className="text-xl font-bold text-foreground">ระบบล้งทุเรียน</h1>
          <p className="text-xs text-muted-foreground">Durian Packing House</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">อีเมล</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@durian.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">รหัสผ่าน</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" />
            </div>
            {error && (
              <p className="text-xs text-destructive text-center bg-destructive/10 rounded-md p-2">{error}</p>
            )}
            <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
          </form>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">🔑 บัญชีทดสอบ (กดเพื่อ Login เลย)</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc.email)}
                  className="w-full text-left p-2 rounded-md border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{acc.role}</span>
                    <span className="text-[10px] text-muted-foreground">{acc.email}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{acc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
