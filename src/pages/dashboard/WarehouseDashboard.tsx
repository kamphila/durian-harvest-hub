import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer } from 'lucide-react';

const stockSummary = [
  { type: 'Stock ดิบ', qty: '2,500 กก.', lots: 5 },
  { type: 'Stock คัดแล้ว', qty: '1,800 กก.', lots: 4 },
  { type: 'Stock แพ็คแล้ว', qty: '120 กล่อง', lots: 3 },
  { type: 'รอส่งออก', qty: '80 กล่อง', lots: 2 },
];

const agingLots = [
  { lotNo: 'LOT-20250613-001', product: 'หมอนทอง', qty: '350 กก.', type: 'ดิบ', days: 4, status: 'urgent' },
  { lotNo: 'LOT-20250614-002', product: 'หมอนทอง', qty: '200 กก.', type: 'คัดแล้ว', days: 3, status: 'warning' },
  { lotNo: 'LOT-20250615-001', product: 'ชะนี', qty: '450 กก.', type: 'ดิบ', days: 2, status: 'ok' },
  { lotNo: 'LOT-20250616-001', product: 'หมอนทอง', qty: '500 กก.', type: 'ดิบ', days: 1, status: 'ok' },
];

export default function WarehouseDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">📦 Dashboard คลังสินค้า</h1>
        <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์รายงาน</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stockSummary.map((s) => (
          <Card key={s.type}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-xs text-muted-foreground">{s.type}</p>
              <p className="text-xl font-bold">{s.qty}</p>
              <p className="text-[10px] text-muted-foreground">{s.lots} Lots</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">อายุสินค้า (Day Aging)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead className="text-xs">Lot No.</TableHead><TableHead className="text-xs">สินค้า</TableHead><TableHead className="text-xs">จำนวน</TableHead><TableHead className="text-xs">ประเภท</TableHead><TableHead className="text-xs text-right">อายุ(วัน)</TableHead><TableHead className="text-xs">สถานะ</TableHead></TableRow></TableHeader>
            <TableBody>
              {agingLots.map((l) => (
                <TableRow key={l.lotNo}>
                  <TableCell className="text-xs font-mono">{l.lotNo}</TableCell>
                  <TableCell className="text-xs">{l.product}</TableCell>
                  <TableCell className="text-xs">{l.qty}</TableCell>
                  <TableCell className="text-xs">{l.type}</TableCell>
                  <TableCell className="text-xs text-right font-bold"><span className={l.status === 'urgent' ? 'text-destructive' : l.status === 'warning' ? 'text-warning' : ''}>{l.days}</span></TableCell>
                  <TableCell><Badge variant={l.status === 'urgent' ? 'destructive' : l.status === 'warning' ? 'secondary' : 'default'} className="text-[10px]">{l.status === 'urgent' ? 'เร่งด่วน' : l.status === 'warning' ? 'ใกล้ครบ' : 'ปกติ'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
