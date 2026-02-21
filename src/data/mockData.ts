// ===== Master Data Mock =====

export interface Company {
  id: string; code: string; name: string; taxId: string; address: string; phone: string; pk7: string; doa: string; gap: string;
}
export const mockCompanies: Company[] = [
  { id: '1', code: 'C001', name: 'ล้งทุเรียนทอง จำกัด', taxId: '0105556000001', address: '123 ถ.สุขุมวิท จันทบุรี', phone: '039-123456', pk7: 'PK7-001', doa: 'DOA-001', gap: 'GAP-001' },
  { id: '2', code: 'C002', name: 'ล้งทุเรียนเพชร จำกัด', taxId: '0105556000002', address: '456 ถ.ตากสิน ระยอง', phone: '038-654321', pk7: 'PK7-002', doa: 'DOA-002', gap: 'GAP-002' },
];

export interface Branch { id: string; code: string; name: string; address: string; phone: string; }
export const mockBranches: Branch[] = [
  { id: '1', code: 'B001', name: 'สาขาจันทบุรี', address: '123 ถ.สุขุมวิท', phone: '039-111111' },
  { id: '2', code: 'B002', name: 'สาขาระยอง', address: '456 ถ.ตากสิน', phone: '038-222222' },
];

export interface Department { id: string; code: string; name: string; }
export const mockDepartments: Department[] = [
  { id: '1', code: 'D001', name: 'ฝ่ายรับซื้อ' },
  { id: '2', code: 'D002', name: 'ฝ่ายคัดเกรด' },
  { id: '3', code: 'D003', name: 'ฝ่ายแพ็ค' },
  { id: '4', code: 'D004', name: 'ฝ่ายขาย' },
];

export interface ProductGroup { id: string; code: string; name: string; }
export const mockProductGroups: ProductGroup[] = [
  { id: '1', code: 'PG01', name: 'ทุเรียนสด' },
  { id: '2', code: 'PG02', name: 'ทุเรียนแช่แข็ง' },
  { id: '3', code: 'PG03', name: 'ทุเรียนแปรรูป' },
];

export interface Unit { id: string; code: string; name: string; boxSize: string; }
export const mockUnits: Unit[] = [
  { id: '1', code: 'U01', name: 'กิโลกรัม', boxSize: '-' },
  { id: '2', code: 'U02', name: 'กล่อง 10 กก.', boxSize: '10 กก.' },
  { id: '3', code: 'U03', name: 'กล่อง 15 กก.', boxSize: '15 กก.' },
];

export interface Product { id: string; code: string; name: string; unitId: string; unitName: string; groupId: string; groupName: string; }
export const mockProducts: Product[] = [
  { id: '1', code: 'P001', name: 'ทุเรียนหมอนทอง', unitId: '1', unitName: 'กิโลกรัม', groupId: '1', groupName: 'ทุเรียนสด' },
  { id: '2', code: 'P002', name: 'ทุเรียนชะนี', unitId: '1', unitName: 'กิโลกรัม', groupId: '1', groupName: 'ทุเรียนสด' },
  { id: '3', code: 'P003', name: 'ทุเรียนก้านยาว', unitId: '1', unitName: 'กิโลกรัม', groupId: '1', groupName: 'ทุเรียนสด' },
];

export interface Grade { id: string; code: string; name: string; }
export const mockGrades: Grade[] = [
  { id: '1', code: 'A', name: 'เกรด A (ส่งออก)' },
  { id: '2', code: 'B', name: 'เกรด B (ในประเทศ)' },
  { id: '3', code: 'C', name: 'เกรด C (ตกเกรด)' },
  { id: '4', code: 'D', name: 'เกรด D (คัดทิ้ง)' },
];

export interface CuttingTeam {
  id: string; code: string; name: string; idCard: string; address: string; phone: string; licensePlate: string; bankAccount: string;
}
export const mockCuttingTeams: CuttingTeam[] = [
  { id: '1', code: 'CT01', name: 'สายตัด สมบูรณ์', idCard: '1-1234-56789-01-2', address: '11 ม.3 ต.ท่าใหม่ จันทบุรี', phone: '081-1111111', licensePlate: 'กข 1234', bankAccount: '123-4-56789-0' },
  { id: '2', code: 'CT02', name: 'สายตัด มงคล', idCard: '1-9876-54321-01-2', address: '22 ม.5 ต.มะขาม จันทบุรี', phone: '082-2222222', licensePlate: 'คง 5678', bankAccount: '987-6-54321-0' },
];

export interface Supplier {
  id: string; code: string; name: string; type: 'บุคคล' | 'นิติบุคคล'; taxId: string; address: string; phone: string;
}
export const mockSuppliers: Supplier[] = [
  { id: '1', code: 'S001', name: 'สวนทุเรียนลุงสม', type: 'บุคคล', taxId: '1-1234-56789-01-2', address: '33 ม.2 ต.เขาคิชฌกูฏ จันทบุรี', phone: '083-3333333' },
  { id: '2', code: 'S002', name: 'สวนทองคำ จำกัด', type: 'นิติบุคคล', taxId: '0105556000003', address: '44 ม.7 ต.ท่าใหม่ จันทบุรี', phone: '084-4444444' },
  { id: '3', code: 'S003', name: 'สวนลุงประสิทธิ์', type: 'บุคคล', taxId: '3-4567-89012-34-5', address: '55 ม.1 ต.สอยดาว จันทบุรี', phone: '085-5555555' },
];

export interface Customer {
  id: string; code: string; name: string; type: 'บุคคล' | 'นิติบุคคล'; taxId: string; address: string; phone: string;
}
export const mockCustomers: Customer[] = [
  { id: '1', code: 'CU01', name: 'Fruit Trading Co., Ltd', type: 'นิติบุคคล', taxId: '0105556000010', address: 'Bangkok, Thailand', phone: '02-1234567' },
  { id: '2', code: 'CU02', name: 'China Fresh Import', type: 'นิติบุคคล', taxId: 'CN123456789', address: 'Guangzhou, China', phone: '+86-20-12345678' },
];

export interface BankAccount { id: string; code: string; accountNo: string; name: string; bank: string; }
export const mockBankAccounts: BankAccount[] = [
  { id: '1', code: 'BA01', accountNo: '123-456-7890', name: 'บัญชีรับซื้อ', bank: 'กสิกรไทย' },
  { id: '2', code: 'BA02', accountNo: '987-654-3210', name: 'บัญชีขาย', bank: 'กรุงเทพ' },
];
