import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryItem, mockInventory } from '@/data/mockTransactions';

const stockTypeLabels: Record<string, string> = { raw: 'ดิบ (ยังไม่คัด)', graded: 'คัดแล้ว', packed: 'แพ็คแล้ว' };
const stockTypeColors: Record<string, string> = { raw: 'bg-warning/10 text-warning', graded: 'bg-info/10 text-info', packed: 'bg-success/10 text-success' };

export default function InventoryPage() {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? mockInventory : mockInventory.filter((i) => i.stockType === tab);

  const summaries = [
    { type: 'raw', label: 'Stock ดิบ', qty: mockInventory.filter((i) => i.stockType === 'raw').reduce((s, i) => s + i.quantity, 0), unit: 'กก.' },
    { type: 'graded', label: 'Stock คัดแล้ว', qty: mockInventory.filter((i) => i.stockType === 'graded').reduce((s, i) => s + i.quantity, 0), unit: 'กก.' },
    { type: 'packed', label: 'Stock แพ็คแล้ว', qty: mockInventory.filter((i) => i.stockType === 'packed').reduce((s, i) => s + i.quantity, 0), unit: 'กล่อง' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">คลังสินค้า (Inventory)</h1>

      <div className="grid grid-cols-3 gap-3">
        {summaries.map((s) => (
          <Card key={s.type} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <span className="text-xl font-bold">{s.qty.toLocaleString('th-TH')}</span>
              <span className="text-sm text-muted-foreground ml-1">{s.unit}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="raw">ดิบ</TabsTrigger>
          <TabsTrigger value="graded">คัดแล้ว</TabsTrigger>
          <TabsTrigger value="packed">แพ็คแล้ว</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="rounded-md border bg-card overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Lot No.</TableHead>
                  <TableHead className="text-xs">สินค้า</TableHead>
                  <TableHead className="text-xs">เกรด</TableHead>
                  <TableHead className="text-xs">ประเภท</TableHead>
                  <TableHead className="text-xs text-right">จำนวน</TableHead>
                  <TableHead className="text-xs">หน่วย</TableHead>
                  <TableHead className="text-xs">วันที่รับ</TableHead>
                  <TableHead className="text-xs text-right">อายุ(วัน)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs">{idx + 1}</TableCell>
                    <TableCell className="text-sm font-mono">{item.lotNo}</TableCell>
                    <TableCell className="text-sm">{item.productName}</TableCell>
                    <TableCell className="text-sm">{item.gradeName}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${stockTypeColors[item.stockType]}`}>
                        {stockTypeLabels[item.stockType]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-right font-semibold">{item.quantity.toLocaleString('th-TH')}</TableCell>
                    <TableCell className="text-sm">{item.unitName}</TableCell>
                    <TableCell className="text-sm">{item.receivedDate}</TableCell>
                    <TableCell className="text-sm text-right">
                      <span className={item.dayAging >= 3 ? 'text-destructive font-bold' : item.dayAging >= 2 ? 'text-warning' : ''}>
                        {item.dayAging}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
