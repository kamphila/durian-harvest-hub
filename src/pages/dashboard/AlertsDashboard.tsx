import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, DollarSign, Truck, Clock, Printer } from 'lucide-react';

const alerts = [
  { id: 1, type: 'yield', icon: TrendingDown, title: 'Yield ต่ำกว่า 65%', desc: 'LOT-20250614-002 Yield 62.3% ต่ำกว่าเกณฑ์ 65%', severity: 'error', time: '2 ชม. ที่แล้ว' },
  { id: 2, type: 'loss', icon: AlertTriangle, title: 'Loss สูงผิดปกติ', desc: 'สวนมาลี Loss 18% สูงกว่าค่าเฉลี่ย 10%', severity: 'error', time: '3 ชม. ที่แล้ว' },
  { id: 3, type: 'price', icon: DollarSign, title: 'ราคาซื้อเกิน Margin', desc: 'ราคาซื้อเฉลี่ย ฿135/กก. สูงกว่าเกณฑ์ ฿130/กก.', severity: 'warning', time: '5 ชม. ที่แล้ว' },
  { id: 4, type: 'ar', icon: Clock, title: 'ลูกค้าค้างชำระเกินกำหนด', desc: 'China Fresh Import ค้างชำระ ฿450,000 เกิน 15 วัน', severity: 'warning', time: '1 วัน ที่แล้ว' },
  { id: 5, type: 'container', icon: Truck, title: 'Container ใกล้วันส่งออก', desc: 'HLCU-7654321 ต้องส่งภายใน 2 วัน ยังโหลดไม่เสร็จ', severity: 'warning', time: '4 ชม. ที่แล้ว' },
  { id: 6, type: 'yield', icon: TrendingDown, title: 'Yield ต่ำกว่า 65%', desc: 'LOT-20250613-003 Yield 58.1% ต่ำมาก ตรวจสอบคุณภาพสวน', severity: 'error', time: '1 วัน ที่แล้ว' },
];

export default function AlertsDashboard() {
  const errorCount = alerts.filter((a) => a.severity === 'error').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:mb-4">
        <h1 className="text-lg font-bold">🔔 ระบบแจ้งเตือน</h1>
        <div className="flex gap-2 items-center">
          <Badge variant="destructive">{errorCount} เร่งด่วน</Badge>
          <Badge variant="secondary">{warningCount} เตือน</Badge>
          <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" />พิมพ์</Button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${alert.severity === 'error' ? 'border-l-destructive' : 'border-l-warning'}`}>
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <alert.icon className={`h-5 w-5 mt-0.5 shrink-0 ${alert.severity === 'error' ? 'text-destructive' : 'text-warning'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{alert.title}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
