import { UserRole } from '@/contexts/AuthContext';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  active: boolean;
}

export const mockUsers: MockUser[] = [
  { id: '1', name: 'ผู้ดูแลระบบ', email: 'admin@durian.com', role: 'admin', companyId: '', companyName: '(ดูแลทุกบริษัท)', active: true },
  { id: '2', name: 'สมชาย ทุเรียนทอง', email: 'somchai@durian.com', role: 'owner', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด', active: true },
  { id: '3', name: 'สมหญิง รับซื้อ', email: 'somying@durian.com', role: 'purchase', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด', active: true },
  { id: '4', name: 'สมศักดิ์ คัดเกรด', email: 'somsak@durian.com', role: 'grading', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด', active: true },
  { id: '5', name: 'วิชัย คลังสินค้า', email: 'wichai@durian.com', role: 'warehouse', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด', active: true },
  { id: '6', name: 'นภา ฝ่ายขาย', email: 'napa@durian.com', role: 'sales', companyId: 'C002', companyName: 'ล้งทุเรียนเพชร จำกัด', active: true },
  { id: '7', name: 'ประยุทธ์ การเงิน', email: 'prayut@durian.com', role: 'finance', companyId: 'C002', companyName: 'ล้งทุเรียนเพชร จำกัด', active: false },
];
