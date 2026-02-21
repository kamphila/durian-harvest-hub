import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const profitByContainer = [
  { name: 'MSKU-1234', profit: 95000 }, { name: 'HLCU-7654', profit: 78000 },
  { name: 'CMAU-9876', profit: 105000 }, { name: 'TCLU-1122', profit: 62000 },
];

const profitByGrade = [
  { grade: 'เกรด A', costPerKg: 120, sellPerKg: 180, margin: 60, profitPercent: 33 },
  { grade: 'เกรด B', costPerKg: 80, sellPerKg: 110, margin: 30, profitPercent: 27 },
  { grade: 'เกรด C', costPerKg: 50, sellPerKg: 60, margin: 10, profitPercent: 17 },
];

const profitByOrchard = [
  { name: 'สวนลุงสม', profit: 185000 }, { name: 'สวนทองคำ', profit: 142000 },
  { name: 'สวนมาลี', profit: 120000 }, { name: 'สวนบุญมี', profit: 98000 },
  { name: 'สวนลุงประสิทธิ์', profit: 95000 },
];

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function ProfitDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">💰 Dashboard วิเคราะห์กำไร</h1>
        <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์รายงาน</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">กำไรต่อ Container</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={profitByContainer}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`฿${fmt(v)}`, 'กำไร']} />
                <Bar dataKey="profit" fill="hsl(130, 60%, 35%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">กำไรต่อสวน (Top 5)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={profitByOrchard} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`฿${fmt(v)}`, 'กำไร']} />
                <Bar dataKey="profit" fill="hsl(85, 60%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">กำไรต่อเกรด</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead className="text-xs">เกรด</TableHead><TableHead className="text-xs text-right">ต้นทุน/กก.</TableHead><TableHead className="text-xs text-right">ขาย/กก.</TableHead><TableHead className="text-xs text-right">Margin/กก.</TableHead><TableHead className="text-xs text-right">กำไร %</TableHead></TableRow></TableHeader>
            <TableBody>
              {profitByGrade.map((g) => (
                <TableRow key={g.grade}>
                  <TableCell className="text-sm">{g.grade}</TableCell>
                  <TableCell className="text-sm text-right">฿{g.costPerKg}</TableCell>
                  <TableCell className="text-sm text-right">฿{g.sellPerKg}</TableCell>
                  <TableCell className="text-sm text-right font-semibold text-success">฿{g.margin}</TableCell>
                  <TableCell className="text-sm text-right">{g.profitPercent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
