import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fmt = (n: number) => n.toLocaleString('th-TH');

const orchardPayments = [
  { date: '2025-06-16', docNo: 'PU-2568-0003', name: 'สวนลุงประสิทธิ์', amount: 8250, method: 'โอน' },
  { date: '2025-06-15', docNo: 'PU-2568-0001', name: 'สวนลุงสม', amount: 14400, method: 'โอน' },
  { date: '2025-06-15', docNo: 'PU-2568-0002', name: 'สวนทองคำ', amount: 12250, method: 'เงินสด' },
];

const customerReceipts = [
  { date: '2025-06-18', docNo: 'SL-2568-0001', name: 'China Fresh', amount: 94000, method: 'หักมัดจำ' },
  { date: '2025-06-20', docNo: 'SL-2568-0002', name: 'Fruit Trading', amount: 150000, method: 'โอน' },
];

const arAp = [
  { type: 'ลูกหนี้', name: 'China Fresh', amount: 450000, days: 15 },
  { type: 'ลูกหนี้', name: 'HK Durian', amount: 200000, days: 8 },
  { type: 'เจ้าหนี้', name: 'สวนลุงประสิทธิ์', amount: 8250, days: 1 },
];

const profitByLot = [
  { lot: 'LOT-20250615-001', product: 'หมอนทอง', cost: 19400, revenue: 28500, profit: 9100, margin: '31.9%' },
  { lot: 'LOT-20250616-001', product: 'ชะนี', cost: 11250, revenue: 14400, profit: 3150, margin: '21.9%' },
];

export default function FinanceReport() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">📋 รายงานการเงิน</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ l: 'จ่ายสวน (เดือนนี้)', v: '฿34,900' }, { l: 'รับลูกค้า (เดือนนี้)', v: '฿244,000' }, { l: 'ลูกหนี้รวม', v: '฿650,000' }, { l: 'เจ้าหนี้รวม', v: '฿8,250' }].map((s) => (
          <Card key={s.l}><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-xl font-bold">{s.v}</p></CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="orchard">
        <TabsList>
          <TabsTrigger value="orchard">จ่ายเงินสวน</TabsTrigger>
          <TabsTrigger value="customer">รับเงินลูกค้า</TabsTrigger>
          <TabsTrigger value="arap">ลูกหนี้/เจ้าหนี้</TabsTrigger>
          <TabsTrigger value="lot-profit">กำไรต่อ Lot</TabsTrigger>
        </TabsList>
        <TabsContent value="orchard">
          <Card><CardContent className="pt-4">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">วันที่</TableHead><TableHead className="text-xs">เลขที่</TableHead><TableHead className="text-xs">สวน</TableHead><TableHead className="text-xs text-right">จำนวนเงิน</TableHead><TableHead className="text-xs">ช่องทาง</TableHead></TableRow></TableHeader>
              <TableBody>
                {orchardPayments.map((p) => (
                  <TableRow key={p.docNo}><TableCell className="text-sm">{p.date}</TableCell><TableCell className="text-sm font-mono">{p.docNo}</TableCell><TableCell className="text-sm">{p.name}</TableCell><TableCell className="text-sm text-right font-semibold">฿{fmt(p.amount)}</TableCell><TableCell className="text-sm">{p.method}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="customer">
          <Card><CardContent className="pt-4">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">วันที่</TableHead><TableHead className="text-xs">เลขที่</TableHead><TableHead className="text-xs">ลูกค้า</TableHead><TableHead className="text-xs text-right">จำนวนเงิน</TableHead><TableHead className="text-xs">ช่องทาง</TableHead></TableRow></TableHeader>
              <TableBody>
                {customerReceipts.map((r) => (
                  <TableRow key={r.docNo}><TableCell className="text-sm">{r.date}</TableCell><TableCell className="text-sm font-mono">{r.docNo}</TableCell><TableCell className="text-sm">{r.name}</TableCell><TableCell className="text-sm text-right font-semibold text-success">฿{fmt(r.amount)}</TableCell><TableCell className="text-sm">{r.method}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="arap">
          <Card><CardContent className="pt-4">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">ประเภท</TableHead><TableHead className="text-xs">ชื่อ</TableHead><TableHead className="text-xs text-right">จำนวนเงิน</TableHead><TableHead className="text-xs text-right">ค้าง(วัน)</TableHead></TableRow></TableHeader>
              <TableBody>
                {arAp.map((a, i) => (
                  <TableRow key={i}><TableCell className="text-sm">{a.type}</TableCell><TableCell className="text-sm">{a.name}</TableCell><TableCell className="text-sm text-right font-semibold">฿{fmt(a.amount)}</TableCell><TableCell className="text-sm text-right">{a.days}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="lot-profit">
          <Card><CardContent className="pt-4">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">Lot</TableHead><TableHead className="text-xs">สินค้า</TableHead><TableHead className="text-xs text-right">ต้นทุน</TableHead><TableHead className="text-xs text-right">รายได้</TableHead><TableHead className="text-xs text-right">กำไร</TableHead><TableHead className="text-xs text-right">Margin</TableHead></TableRow></TableHeader>
              <TableBody>
                {profitByLot.map((l) => (
                  <TableRow key={l.lot}><TableCell className="text-xs font-mono">{l.lot}</TableCell><TableCell className="text-sm">{l.product}</TableCell><TableCell className="text-sm text-right">฿{fmt(l.cost)}</TableCell><TableCell className="text-sm text-right">฿{fmt(l.revenue)}</TableCell><TableCell className="text-sm text-right font-semibold text-success">฿{fmt(l.profit)}</TableCell><TableCell className="text-sm text-right">{l.margin}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
