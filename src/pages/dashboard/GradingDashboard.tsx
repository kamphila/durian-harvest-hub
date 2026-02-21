import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const yieldDaily = [
  { day: '10 มิ.ย.', yield: 72 }, { day: '11 มิ.ย.', yield: 68 }, { day: '12 มิ.ย.', yield: 75 },
  { day: '13 มิ.ย.', yield: 70 }, { day: '14 มิ.ย.', yield: 73 }, { day: '15 มิ.ย.', yield: 69 }, { day: '16 มิ.ย.', yield: 71 },
];

const gradeRatio = [
  { name: 'เกรด A', value: 45, color: 'hsl(130, 60%, 35%)' },
  { name: 'เกรด B', value: 28, color: 'hsl(200, 80%, 50%)' },
  { name: 'เกรด C', value: 17, color: 'hsl(40, 90%, 50%)' },
  { name: 'Loss', value: 10, color: 'hsl(0, 84%, 60%)' },
];

const stats = [
  { label: 'Yield วันนี้', value: '72.5%' },
  { label: 'Yield เฉลี่ยสัปดาห์', value: '71.1%' },
  { label: 'น้ำหนักสูญเสีย', value: '1,250 กก.' },
  { label: 'เกรด A %', value: '45%' },
];

export default function GradingDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">📊 Dashboard ฝ่ายคัดเกรด</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Yield % รายวัน</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yieldDaily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis domain={[60, 80]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Yield']} />
                <Bar dataKey="yield" fill="hsl(85, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">สัดส่วนเกรด</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={gradeRatio} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {gradeRatio.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
