import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, Package, Truck, DollarSign, BarChart3, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'รับซื้อวันนี้', value: '12.5 ตัน', change: '+8%', up: true, icon: Package, gradient: 'from-emerald-500/15 to-emerald-600/5', iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  { label: 'ยอดขายวันนี้', value: '฿1,250,000', change: '+12%', up: true, icon: DollarSign, gradient: 'from-blue-500/15 to-blue-600/5', iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { label: 'กำไรขั้นต้น', value: '฿385,000', change: '+5%', up: true, icon: TrendingUp, gradient: 'from-green-500/15 to-green-600/5', iconBg: 'bg-green-500/15 text-green-600 dark:text-green-400' },
  { label: 'Yield %', value: '72.5%', change: '-2%', up: false, icon: BarChart3, gradient: 'from-amber-500/15 to-amber-600/5', iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { label: 'Container รอส่ง', value: '3 ตู้', change: '', up: true, icon: Truck, gradient: 'from-violet-500/15 to-violet-600/5', iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  { label: 'ลูกหนี้คงค้าง', value: '฿2,450,000', change: '', up: false, icon: DollarSign, gradient: 'from-rose-500/15 to-rose-600/5', iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
];

const recentPurchases = [
  { time: '14:30', orchard: 'สวนลุงสม', weight: '2,500 กก.', amount: '฿175,000', grade: 'A' },
  { time: '13:15', orchard: 'สวนทองคำ', weight: '1,800 กก.', amount: '฿126,000', grade: 'B' },
  { time: '11:00', orchard: 'สวนลุงประสิทธิ์', weight: '3,200 กก.', amount: '฿224,000', grade: 'A' },
  { time: '09:45', orchard: 'สวนป้าแก้ว', weight: '1,500 กก.', amount: '฿105,000', grade: 'C' },
];

const containers = [
  { container: 'MSKU-1234567', status: 'กำลังโหลด', customer: 'China Fresh', progress: 65, eta: '2 วัน' },
  { container: 'HLCU-7654321', status: 'เตรียมของ', customer: 'Fruit Trading', progress: 30, eta: '5 วัน' },
  { container: 'CMAU-9876543', status: 'ส่งออกแล้ว', customer: 'China Fresh', progress: 100, eta: 'ถึงแล้ว' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'อรุณสวัสดิ์';
  if (h < 17) return 'สวัสดีตอนบ่าย';
  return 'สวัสดีตอนเย็น';
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}, {user?.name} 🍈</h1>
            <p className="text-sm text-muted-foreground mt-1">ภาพรวมระบบล้งทุเรียนวันนี้ — {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>อัพเดทล่าสุด {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className={`relative overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} pointer-events-none`} />
            <CardContent className="relative p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-medium text-muted-foreground leading-tight">{s.label}</span>
                <div className={`p-1.5 rounded-lg ${s.iconBg}`}>
                  <s.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="text-lg font-bold tracking-tight">{s.value}</div>
              {s.change && (
                <div className={`flex items-center gap-1 text-[10px] mt-1 font-medium ${s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.change} จากเมื่อวาน
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent purchases */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">🧾 รับซื้อล่าสุด</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-normal">วันนี้ 4 รายการ</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentPurchases.map((r) => (
                <div key={r.time} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center min-w-[36px]">
                      <span className="text-[10px] text-muted-foreground">{r.time}</span>
                    </div>
                    <div>
                      <span className="font-medium text-sm">{r.orchard}</span>
                      <div className="text-[11px] text-muted-foreground">{r.weight}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.grade === 'A' ? 'default' : r.grade === 'B' ? 'secondary' : 'outline'} className="text-[10px] h-5 min-w-[24px] justify-center">
                      {r.grade}
                    </Badge>
                    <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 min-w-[80px] text-right">{r.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t bg-muted/20">
              <button className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                ดูทั้งหมด <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Container Status */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">🚢 Container Status</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-normal">{containers.length} ตู้</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {containers.map((c) => (
                <div key={c.container} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">{c.container}</span>
                      <Badge
                        variant={c.progress === 100 ? 'default' : 'outline'}
                        className={`text-[10px] h-5 ${
                          c.progress === 100
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : c.progress > 50
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : ''
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">ETA: {c.eta}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{c.customer}</span>
                    <span className="font-medium">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t bg-muted/20">
              <button className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                ดูทั้งหมด <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
