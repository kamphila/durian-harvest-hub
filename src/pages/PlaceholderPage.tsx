import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-sm text-center">
        <CardContent className="pt-8 pb-6">
          <Construction className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">หน้านี้อยู่ระหว่างการพัฒนา</p>
        </CardContent>
      </Card>
    </div>
  );
}
