import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Package, Truck, DollarSign, BarChart3, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const purchaseTrend = [
  { day: 'จ.', weight: 8500 }, { day: 'อ.', weight: 12000 }, { day: 'พ.', weight: 10500 },
  { day: 'พฤ.', weight: 15000 }, { day: 'ศ.', weight: 13500 }, { day: 'ส.', weight: 9000 }, { day: 'อา.', weight: 7000 },
];

const yieldTrend = [
  { day: 'จ.', yield: 72 }, { day: 'อ.', yield: 68 }, { day: 'พ.', yield: 75 },
  { day: 'พฤ.', yield: 70 }, { day: 'ศ.', yield: 73 }, { day: 'ส.', yield: 69 }, { day: 'อา.', yield: 71 },
];

const gradeDistribution = [
  { name: 'เกรด A', value: 45, color: 'hsl(130, 60%, 35%)' },
  { name: 'เกรด B', value: 30, color: 'hsl(200, 80%, 50%)' },
  { name: 'เกรด C', value: 15, color: 'hsl(40, 90%, 50%)' },
  { name: 'Loss', value: 10, color: 'hsl(0, 84%, 60%)' },
];

const containerStatus = [
  { container: 'MSKU-1234567', customer: 'China Fresh', status: 'loading', value: 144000 },
  { container: 'HLCU-7654321', customer: 'Fruit Trading', status: 'preparing', value: 150000 },
  { container: 'CMAU-9876543', customer: 'China Fresh', status: 'exported', value: 180000 },
  { container: 'TCLU-1122334', customer: 'HK Durian', status: 'paid', value: 165000 },
];

const fmt = (n: number) => n.toLocaleString('th-TH');

const stats = [
  { label: 'รับซื้อวันนี้', value: '12.5 ตัน', change: '+8%', up: true, icon: Package },
  { label: 'กำไรวันนี้', value: '฿385,000', change: '+5%', up: true, icon: DollarSign },
  { label: 'กำไรเดือนนี้', value: '฿4.2M', change: '+12%', up: true, icon: TrendingUp },
  { label: 'Yield %', value: '72.5%', change: '-2%', up: false, icon: BarChart3 },
  { label: 'กำไร/Container', value: '฿85,000', change: '+3%', up: true, icon: Truck },
  { label: 'Margin/กก.', value: '฿35', change: '+2', up: true, icon: TrendingUp },
];

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">📊 Dashboard ผู้บริหาร</h1>
        <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์รายงาน</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1 pt-3 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold">{s.value}</div>
              <div className={`text-[10px] flex items-center gap-0.5 ${s.up ? 'text-success' : 'text-destructive'}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {s.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">ปริมาณรับซื้อ (สัปดาห์นี้)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={purchaseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(130,15%,85%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${fmt(v)} กก.`, 'น้ำหนัก']} />
                <Bar dataKey="weight" fill="hsl(130, 70%, 16%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Yield % Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={yieldTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(130,15%,85%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 80]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Yield']} />
                <Line type="monotone" dataKey="yield" stroke="hsl(85, 60%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(85, 60%, 45%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">สัดส่วนเกรด</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {gradeDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Container Status</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">เลขตู้</TableHead><TableHead className="text-xs">ลูกค้า</TableHead><TableHead className="text-xs">สถานะ</TableHead><TableHead className="text-xs text-right">มูลค่า</TableHead></TableRow></TableHeader>
              <TableBody>
                {containerStatus.map((c) => (
                  <TableRow key={c.container}>
                    <TableCell className="text-xs font-mono">{c.container}</TableCell>
                    <TableCell className="text-xs">{c.customer}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{c.status === 'loading' ? 'โหลด' : c.status === 'preparing' ? 'เตรียม' : c.status === 'exported' ? 'ส่งแล้ว' : 'รับเงิน'}</Badge></TableCell>
                    <TableCell className="text-xs text-right">฿{fmt(c.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
