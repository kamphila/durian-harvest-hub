import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, Copy, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { mockProducts, mockGrades } from '@/data/mockData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PriceRow {
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  price: number;
}

interface DailyPriceData {
  date: string; // YYYY-MM-DD
  rows: PriceRow[];
}

function formatDateThai(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function generateDefaultRows(): PriceRow[] {
  const rows: PriceRow[] = [];
  for (const product of mockProducts) {
    for (const grade of mockGrades) {
      rows.push({
        productId: product.id,
        productName: product.name,
        gradeId: grade.id,
        gradeName: grade.name,
        price: 0,
      });
    }
  }
  return rows;
}

// Mock some historical data
function generateMockHistory(): Map<string, PriceRow[]> {
  const map = new Map<string, PriceRow[]>();
  const basePrices: Record<string, Record<string, number>> = {
    '1': { '1': 180, '2': 120, '3': 60, '4': 15 },
    '2': { '1': 150, '2': 100, '3': 50, '4': 10 },
    '3': { '1': 200, '2': 140, '3': 70, '4': 20 },
  };

  for (let i = 1; i <= 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStr(d);
    const rows: PriceRow[] = [];
    for (const product of mockProducts) {
      for (const grade of mockGrades) {
        const base = basePrices[product.id]?.[grade.id] ?? 0;
        const variation = Math.round((Math.random() - 0.5) * 10);
        rows.push({
          productId: product.id,
          productName: product.name,
          gradeId: grade.id,
          gradeName: grade.name,
          price: Math.max(0, base + variation),
        });
      }
    }
    map.set(dateStr, rows);
  }

  // Today's data
  const today = toDateStr(new Date());
  const todayRows: PriceRow[] = [];
  for (const product of mockProducts) {
    for (const grade of mockGrades) {
      todayRows.push({
        productId: product.id,
        productName: product.name,
        gradeId: grade.id,
        gradeName: grade.name,
        price: basePrices[product.id]?.[grade.id] ?? 0,
      });
    }
  }
  map.set(today, todayRows);

  return map;
}

export default function PurchasePricePage() {
  const [priceHistory] = useState<Map<string, PriceRow[]>>(() => generateMockHistory());
  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));
  const [rows, setRows] = useState<PriceRow[]>(() => {
    const today = toDateStr(new Date());
    return priceHistory.get(today) ?? generateDefaultRows();
  });
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const availableDates = useMemo(() => {
    return Array.from(priceHistory.keys())
      .filter((d) => d !== selectedDate)
      .sort((a, b) => b.localeCompare(a));
  }, [priceHistory, selectedDate]);

  function loadDate(dateStr: string) {
    const existing = priceHistory.get(dateStr);
    setRows(existing ? existing.map((r) => ({ ...r })) : generateDefaultRows());
    setSelectedDate(dateStr);
    setHasChanges(false);
  }

  function navigateDate(direction: -1 | 1) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + direction);
    loadDate(toDateStr(d));
  }

  function handlePriceChange(productId: string, gradeId: string, value: string) {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;
    setRows((prev) =>
      prev.map((r) =>
        r.productId === productId && r.gradeId === gradeId ? { ...r, price: numValue } : r
      )
    );
    setHasChanges(true);
  }

  function handleSave() {
    priceHistory.set(selectedDate, rows.map((r) => ({ ...r })));
    setHasChanges(false);
    toast.success(`บันทึกราคารับซื้อวันที่ ${formatDateShort(selectedDate)} สำเร็จ`);
  }

  function handleCopyFrom(fromDate: string) {
    const sourceRows = priceHistory.get(fromDate);
    if (!sourceRows) {
      toast.error('ไม่พบข้อมูลราคาของวันที่เลือก');
      return;
    }
    setRows(sourceRows.map((r) => ({ ...r })));
    setHasChanges(true);
    setCopyDialogOpen(false);
    toast.success(`คัดลอกราคาจากวันที่ ${formatDateShort(fromDate)} สำเร็จ`);
  }

  // Group rows by product for display
  const groupedByProduct = useMemo(() => {
    const map = new Map<string, PriceRow[]>();
    for (const row of rows) {
      const existing = map.get(row.productId) || [];
      existing.push(row);
      map.set(row.productId, existing);
    }
    return map;
  }, [rows]);

  const isToday = selectedDate === toDateStr(new Date());

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">ราคารับซื้อ</h1>
          <p className="text-sm text-muted-foreground">กำหนดราคารับซื้อสินค้าแต่ละเกรดประจำวัน</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCopyDialogOpen(true)}>
            <Copy className="h-4 w-4 mr-1" />
            คัดลอกจากวันอื่น
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-1" />
            บันทึก
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="p-3">
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[280px] justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{formatDateThai(selectedDate)}</span>
                {isToday && (
                  <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">วันนี้</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="center">
              <div className="space-y-2">
                <label className="text-sm font-medium">เลือกวันที่</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      loadDate(e.target.value);
                      setDatePickerOpen(false);
                    }
                  }}
                />
                {!isToday && (
                  <Button
                    variant="link"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      loadDate(toDateStr(new Date()));
                      setDatePickerOpen(false);
                    }}
                  >
                    กลับไปวันนี้
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Price Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-center py-2">#</TableHead>
                <TableHead className="w-[200px] py-2">สินค้า</TableHead>
                <TableHead className="py-2">เกรด</TableHead>
                <TableHead className="w-[160px] text-right py-2">ราคารับซื้อ (บาท/กก.)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                let rowIndex = 0;
                const tableRows: React.ReactNode[] = [];
                groupedByProduct.forEach((gradeRows, productId) => {
                  gradeRows.forEach((row, gradeIdx) => {
                    rowIndex++;
                    tableRows.push(
                      <TableRow key={`${row.productId}-${row.gradeId}`} className={gradeIdx === 0 ? 'border-t' : ''}>
                        <TableCell className="text-center text-muted-foreground text-xs py-1.5">{rowIndex}</TableCell>
                        <TableCell className={`py-1.5 ${gradeIdx === 0 ? 'font-semibold' : 'text-muted-foreground/40'}`}>
                          {gradeIdx === 0 ? row.productName : ''}
                        </TableCell>
                        <TableCell className="py-1.5">{row.gradeName}</TableCell>
                        <TableCell className="text-right py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-[110px] h-8 ml-auto text-right text-sm"
                            value={row.price || ''}
                            placeholder="0.00"
                            onChange={(e) => handlePriceChange(row.productId, row.gradeId, e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  });
                });
                return tableRows;
              })()}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Copy From Dialog */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>คัดลอกราคาจากวันอื่น</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {availableDates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">ไม่มีข้อมูลราคาวันอื่นให้คัดลอก</p>
            ) : (
              availableDates.map((d) => {
                const dateRows = priceHistory.get(d) ?? [];
                const nonZero = dateRows.filter((r) => r.price > 0).length;
                return (
                  <Button
                    key={d}
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                    onClick={() => handleCopyFrom(d)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{formatDateThai(d)}</div>
                      <div className="text-xs text-muted-foreground">{formatDateShort(d)}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{nonZero} รายการ</span>
                  </Button>
                );
              })
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyDialogOpen(false)}>ยกเลิก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
