import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const topOrchards = [
  { name: 'สวนลุงสม', weight: 12500, avgPrice: 120, yield: 75, profit: 185000 },
  { name: 'สวนทองคำ', weight: 9800, avgPrice: 125, yield: 72, profit: 142000 },
  { name: 'สวนลุงประสิทธิ์', weight: 8200, avgPrice: 110, yield: 68, profit: 95000 },
  { name: 'สวนมาลี', weight: 7500, avgPrice: 115, yield: 74, profit: 120000 },
  { name: 'สวนสมศักดิ์', weight: 6800, avgPrice: 118, yield: 71, profit: 105000 },
  { name: 'สวนประสาท', weight: 6200, avgPrice: 122, yield: 69, profit: 88000 },
  { name: 'สวนบุญมี', weight: 5500, avgPrice: 108, yield: 76, profit: 98000 },
  { name: 'สวนเจริญ', weight: 5000, avgPrice: 130, yield: 70, profit: 75000 },
  { name: 'สวนสุข', weight: 4200, avgPrice: 112, yield: 73, profit: 68000 },
  { name: 'สวนดี', weight: 3800, avgPrice: 115, yield: 67, profit: 52000 },
];

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function PurchaseDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">📊 Dashboard ฝ่ายรับซื้อ</h1>
        <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์รายงาน</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top 10 สวน (น้ำหนัก)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topOrchards} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${fmt(v)} กก.`, 'น้ำหนัก']} />
                <Bar dataKey="weight" fill="hsl(130, 70%, 16%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">รายละเอียดรายสวน</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">สวน</TableHead><TableHead className="text-xs text-right">น้ำหนัก</TableHead><TableHead className="text-xs text-right">ราคาเฉลี่ย</TableHead><TableHead className="text-xs text-right">Yield%</TableHead><TableHead className="text-xs text-right">กำไร</TableHead></TableRow></TableHeader>
              <TableBody>
                {topOrchards.map((o) => (
                  <TableRow key={o.name}>
                    <TableCell className="text-xs">{o.name}</TableCell>
                    <TableCell className="text-xs text-right">{fmt(o.weight)}</TableCell>
                    <TableCell className="text-xs text-right">฿{o.avgPrice}</TableCell>
                    <TableCell className="text-xs text-right"><span className={o.yield >= 70 ? 'text-success' : 'text-warning'}>{o.yield}%</span></TableCell>
                    <TableCell className="text-xs text-right font-semibold">฿{fmt(o.profit)}</TableCell>
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
