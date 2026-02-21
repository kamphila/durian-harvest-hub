import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, Package, Truck, DollarSign, BarChart3 } from 'lucide-react';

const stats = [
  { label: 'รับซื้อวันนี้', value: '12.5 ตัน', change: '+8%', up: true, icon: Package, color: 'text-success' },
  { label: 'ยอดขายวันนี้', value: '฿1,250,000', change: '+12%', up: true, icon: DollarSign, color: 'text-info' },
  { label: 'กำไรขั้นต้น', value: '฿385,000', change: '+5%', up: true, icon: TrendingUp, color: 'text-success' },
  { label: 'Yield %', value: '72.5%', change: '-2%', up: false, icon: BarChart3, color: 'text-warning' },
  { label: 'Container รอส่ง', value: '3 ตู้', change: '', up: true, icon: Truck, color: 'text-primary' },
  { label: 'ลูกหนี้คงค้าง', value: '฿2,450,000', change: '', up: false, icon: DollarSign, color: 'text-destructive' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">สวัสดี, {user?.name} 🍈</h1>
        <p className="text-sm text-muted-foreground">ภาพรวมระบบล้งทุเรียนวันนี้</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-1 pt-3 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold">{s.value}</div>
              {s.change && (
                <div className={`flex items-center gap-0.5 text-[10px] ${s.up ? 'text-success' : 'text-destructive'}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.change} จากเมื่อวาน
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">รับซื้อล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { time: '14:30', orchard: 'สวนลุงสม', weight: '2,500 กก.', amount: '฿175,000' },
                { time: '13:15', orchard: 'สวนทองคำ', weight: '1,800 กก.', amount: '฿126,000' },
                { time: '11:00', orchard: 'สวนลุงประสิทธิ์', weight: '3,200 กก.', amount: '฿224,000' },
              ].map((r) => (
                <div key={r.time} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div>
                    <span className="text-xs text-muted-foreground mr-2">{r.time}</span>
                    <span className="font-medium">{r.orchard}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground mr-2">{r.weight}</span>
                    <span className="font-semibold text-success">{r.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Container Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { container: 'MSKU-1234567', status: 'กำลังโหลด', customer: 'China Fresh', progress: 65 },
                { container: 'HLCU-7654321', status: 'เตรียมของ', customer: 'Fruit Trading', progress: 30 },
                { container: 'CMAU-9876543', status: 'ส่งออกแล้ว', customer: 'China Fresh', progress: 100 },
              ].map((c) => (
                <div key={c.container} className="py-1.5 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium font-mono text-xs">{c.container}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.progress === 100 ? 'bg-success/10 text-success' : c.progress > 50 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.customer}</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1 mt-1">
                    <div className="bg-primary rounded-full h-1 transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
