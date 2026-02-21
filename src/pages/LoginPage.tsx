import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@durian.com');
  const [password, setPassword] = useState('1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
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
            <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
            <p className="text-[10px] text-center text-muted-foreground">Mock: กรอกอะไรก็ได้แล้วกด Login</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
