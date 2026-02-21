import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesByCustomer = [
  { name: 'China Fresh', sales: 1250000, profit: 285000, ar: 450000 },
  { name: 'Fruit Trading', sales: 980000, profit: 215000, ar: 0 },
  { name: 'HK Durian', sales: 750000, profit: 165000, ar: 200000 },
  { name: 'SG Fresh', sales: 520000, profit: 98000, ar: 120000 },
];

const salesByCountry = [
  { country: 'จีน', value: 2200000 }, { country: 'ฮ่องกง', value: 750000 },
  { country: 'สิงคโปร์', value: 520000 }, { country: 'ไทย', value: 380000 },
];

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function SalesDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">📊 Dashboard ฝ่ายขาย</h1>
        <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์รายงาน</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ l: 'ยอดขายเดือนนี้', v: '฿3.85M' }, { l: 'กำไรต่อ Shipment', v: '฿85,000' }, { l: 'ลูกหนี้คงค้าง', v: '฿770,000' }, { l: 'ระยะเวลารับชำระ', v: '12 วัน' }].map((s) => (
          <Card key={s.l}><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-xl font-bold">{s.v}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">ยอดขายรายประเทศ</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesByCountry}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`฿${fmt(v)}`, 'ยอดขาย']} />
                <Bar dataKey="value" fill="hsl(130, 70%, 16%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">รายละเอียดรายลูกค้า</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">ลูกค้า</TableHead><TableHead className="text-xs text-right">ยอดขาย</TableHead><TableHead className="text-xs text-right">กำไร</TableHead><TableHead className="text-xs text-right">ค้างชำระ</TableHead></TableRow></TableHeader>
              <TableBody>
                {salesByCustomer.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="text-xs">{c.name}</TableCell>
                    <TableCell className="text-xs text-right">฿{fmt(c.sales)}</TableCell>
                    <TableCell className="text-xs text-right text-success">฿{fmt(c.profit)}</TableCell>
                    <TableCell className="text-xs text-right">{c.ar > 0 ? <span className="text-destructive">฿{fmt(c.ar)}</span> : '-'}</TableCell>
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
