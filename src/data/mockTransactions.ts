// ===== Transaction Mock Data =====

export interface PurchaseBasket {
  basketNo: number;
  weight: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  baskets: PurchaseBasket[];
  totalWeight: number;
  pricePerKg: number;
  amount: number;
}

export interface Purchase {
  id: string;
  docNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  cuttingTeamId: string;
  cuttingTeamName: string;
  licensePlate: string;
  items: PurchaseItem[];
  totalWeight: number;
  totalAmount: number;
  deposit: number;
  netAmount: number;
  paymentMethod: 'cash' | 'transfer';
  bankAccountId: string;
  status: 'draft' | 'paid';
}

export const mockPurchases: Purchase[] = [
  {
    id: '1', docNo: 'PU-2568-0001', date: '2025-06-15',
    supplierId: '1', supplierName: 'สวนทุเรียนลุงสม',
    cuttingTeamId: '1', cuttingTeamName: 'สายตัด สมบูรณ์',
    licensePlate: 'กข 1234',
    items: [
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', baskets: [{ basketNo: 1, weight: 35 }, { basketNo: 2, weight: 38 }, { basketNo: 3, weight: 32 }], totalWeight: 105, pricePerKg: 120, amount: 12600 },
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '2', gradeName: 'เกรด B', baskets: [{ basketNo: 1, weight: 45 }, { basketNo: 2, weight: 40 }], totalWeight: 85, pricePerKg: 80, amount: 6800 },
    ],
    totalWeight: 190, totalAmount: 19400, deposit: 5000, netAmount: 14400,
    paymentMethod: 'transfer', bankAccountId: '1', status: 'paid',
  },
  {
    id: '2', docNo: 'PU-2568-0002', date: '2025-06-15',
    supplierId: '2', supplierName: 'สวนทองคำ จำกัด',
    cuttingTeamId: '2', cuttingTeamName: 'สายตัด มงคล',
    licensePlate: 'คง 5678',
    items: [
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', baskets: [{ basketNo: 1, weight: 50 }, { basketNo: 2, weight: 48 }], totalWeight: 98, pricePerKg: 125, amount: 12250 },
    ],
    totalWeight: 98, totalAmount: 12250, deposit: 0, netAmount: 12250,
    paymentMethod: 'cash', bankAccountId: '', status: 'paid',
  },
  {
    id: '3', docNo: 'PU-2568-0003', date: '2025-06-16',
    supplierId: '3', supplierName: 'สวนลุงประสิทธิ์',
    cuttingTeamId: '1', cuttingTeamName: 'สายตัด สมบูรณ์',
    licensePlate: 'กข 1234',
    items: [
      { productId: '2', productName: 'ทุเรียนชะนี', gradeId: '1', gradeName: 'เกรด A', baskets: [{ basketNo: 1, weight: 30 }, { basketNo: 2, weight: 28 }, { basketNo: 3, weight: 35 }, { basketNo: 4, weight: 32 }], totalWeight: 125, pricePerKg: 90, amount: 11250 },
    ],
    totalWeight: 125, totalAmount: 11250, deposit: 3000, netAmount: 8250,
    paymentMethod: 'transfer', bankAccountId: '1', status: 'draft',
  },
];

export interface Contract {
  id: string;
  docNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'transfer';
  bankAccountId: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const mockContracts: Contract[] = [
  { id: '1', docNo: 'CT-2568-0001', date: '2025-04-01', supplierId: '1', supplierName: 'สวนทุเรียนลุงสม', totalValue: 500000, paidAmount: 200000, remainingAmount: 300000, paymentMethod: 'transfer', bankAccountId: '1', status: 'active' },
  { id: '2', docNo: 'CT-2568-0002', date: '2025-04-15', supplierId: '2', supplierName: 'สวนทองคำ จำกัด', totalValue: 800000, paidAmount: 800000, remainingAmount: 0, paymentMethod: 'transfer', bankAccountId: '1', status: 'completed' },
];

export interface AdvancePayment {
  id: string;
  docNo: string;
  date: string;
  contractId: string;
  contractNo: string;
  cuttingTeamId: string;
  cuttingTeamName: string;
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  weight: number;
  cutPricePerKg: number;
  amount: number;
  status: 'pending' | 'deducted';
}

export const mockAdvancePayments: AdvancePayment[] = [
  { id: '1', docNo: 'AP-2568-0001', date: '2025-05-01', contractId: '1', contractNo: 'CT-2568-0001', cuttingTeamId: '1', cuttingTeamName: 'สายตัด สมบูรณ์', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', weight: 500, cutPricePerKg: 10, amount: 5000, status: 'deducted' },
  { id: '2', docNo: 'AP-2568-0002', date: '2025-05-10', contractId: '1', contractNo: 'CT-2568-0001', cuttingTeamId: '2', cuttingTeamName: 'สายตัด มงคล', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '2', gradeName: 'เกรด B', weight: 300, cutPricePerKg: 10, amount: 3000, status: 'pending' },
];

export interface PackingItem {
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  quantity: number;
  unitId: string;
  unitName: string;
  pricePerUnit: number;
  amount: number;
}

export interface Packing {
  id: string;
  docNo: string;
  lotNo: string;
  date: string;
  items: PackingItem[];
  totalBoxes: number;
  totalAmount: number;
  yieldPercent: number;
  sourceSupplier: string;
  sourceDate: string;
  status: 'packing' | 'completed';
}

export const mockPackings: Packing[] = [
  {
    id: '1', docNo: 'PK-2568-0001', lotNo: 'LOT-20250615-001', date: '2025-06-15',
    items: [
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', quantity: 8, unitId: '2', unitName: 'กล่อง 10 กก.', pricePerUnit: 1500, amount: 12000 },
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '2', gradeName: 'เกรด B', quantity: 5, unitId: '2', unitName: 'กล่อง 10 กก.', pricePerUnit: 900, amount: 4500 },
    ],
    totalBoxes: 13, totalAmount: 16500, yieldPercent: 72.5,
    sourceSupplier: 'สวนทุเรียนลุงสม', sourceDate: '2025-06-15', status: 'completed',
  },
  {
    id: '2', docNo: 'PK-2568-0002', lotNo: 'LOT-20250616-001', date: '2025-06-16',
    items: [
      { productId: '2', productName: 'ทุเรียนชะนี', gradeId: '1', gradeName: 'เกรด A', quantity: 6, unitId: '3', unitName: 'กล่อง 15 กก.', pricePerUnit: 1200, amount: 7200 },
    ],
    totalBoxes: 6, totalAmount: 7200, yieldPercent: 68.3,
    sourceSupplier: 'สวนลุงประสิทธิ์', sourceDate: '2025-06-16', status: 'packing',
  },
];

export interface SalesItem {
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  quantity: number;
  unitId: string;
  unitName: string;
  pricePerUnit: number;
  amount: number;
}

export interface Sales {
  id: string;
  docNo: string;
  date: string;
  containerNo: string;
  customerId: string;
  customerName: string;
  items: SalesItem[];
  totalAmount: number;
  deposit: number;
  netAmount: number;
  paymentMethod: 'deposit-deduct' | 'transfer';
  bankAccountId: string;
  sampleDate: string;
  sampleCollector: string;
  status: 'preparing' | 'loading' | 'exported' | 'paid';
}

export const mockSales: Sales[] = [
  {
    id: '1', docNo: 'SL-2568-0001', date: '2025-06-18', containerNo: 'MSKU-1234567',
    customerId: '2', customerName: 'China Fresh Import',
    items: [
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', quantity: 80, unitId: '2', unitName: 'กล่อง 10 กก.', pricePerUnit: 1800, amount: 144000 },
    ],
    totalAmount: 144000, deposit: 50000, netAmount: 94000,
    paymentMethod: 'deposit-deduct', bankAccountId: '2',
    sampleDate: '2025-06-17', sampleCollector: 'นายสมศักดิ์', status: 'loading',
  },
  {
    id: '2', docNo: 'SL-2568-0002', date: '2025-06-20', containerNo: 'HLCU-7654321',
    customerId: '1', customerName: 'Fruit Trading Co., Ltd',
    items: [
      { productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', quantity: 60, unitId: '3', unitName: 'กล่อง 15 กก.', pricePerUnit: 2500, amount: 150000 },
    ],
    totalAmount: 150000, deposit: 0, netAmount: 150000,
    paymentMethod: 'transfer', bankAccountId: '2',
    sampleDate: '2025-06-19', sampleCollector: 'นายสมชาย', status: 'preparing',
  },
];

export interface DepositReceive {
  id: string;
  docNo: string;
  date: string;
  customerId: string;
  customerName: string;
  contractRef: string;
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  quantity: number;
  amount: number;
  paymentMethod: 'transfer';
  bankAccountId: string;
  status: 'received' | 'used';
}

export const mockDepositReceives: DepositReceive[] = [
  { id: '1', docNo: 'DR-2568-0001', date: '2025-06-01', customerId: '2', customerName: 'China Fresh Import', contractRef: 'สัญญาขาย #001', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', quantity: 100, amount: 50000, paymentMethod: 'transfer', bankAccountId: '2', status: 'used' },
  { id: '2', docNo: 'DR-2568-0002', date: '2025-06-10', customerId: '1', customerName: 'Fruit Trading Co., Ltd', contractRef: 'สัญญาขาย #002', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', quantity: 80, amount: 40000, paymentMethod: 'transfer', bankAccountId: '2', status: 'received' },
];

export interface Expense {
  id: string;
  docNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  description: string;
  quantity: number;
  unitName: string;
  pricePerUnit: number;
  amount: number;
  paymentMethod: 'cash' | 'transfer';
  bankAccountId: string;
  status: 'recorded' | 'paid';
}

export const mockExpenses: Expense[] = [
  { id: '1', docNo: 'EX-2568-0001', date: '2025-06-15', supplierId: '', supplierName: 'ร้านกล่อง ABC', description: 'กล่องบรรจุทุเรียน 10 กก.', quantity: 500, unitName: 'ใบ', pricePerUnit: 35, amount: 17500, paymentMethod: 'transfer', bankAccountId: '1', status: 'paid' },
  { id: '2', docNo: 'EX-2568-0002', date: '2025-06-16', supplierId: '', supplierName: 'ค่าน้ำมัน', description: 'ค่าน้ำมันรถขนส่ง', quantity: 1, unitName: 'รายการ', pricePerUnit: 5000, amount: 5000, paymentMethod: 'cash', bankAccountId: '', status: 'recorded' },
];

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  gradeId: string;
  gradeName: string;
  stockType: 'raw' | 'graded' | 'packed';
  quantity: number;
  unitName: string;
  lotNo: string;
  receivedDate: string;
  dayAging: number;
}

export const mockInventory: InventoryItem[] = [
  { id: '1', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', stockType: 'raw', quantity: 500, unitName: 'กก.', lotNo: 'LOT-20250616-001', receivedDate: '2025-06-16', dayAging: 1 },
  { id: '2', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', stockType: 'graded', quantity: 350, unitName: 'กก.', lotNo: 'LOT-20250615-001', receivedDate: '2025-06-15', dayAging: 2 },
  { id: '3', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '1', gradeName: 'เกรด A', stockType: 'packed', quantity: 80, unitName: 'กล่อง', lotNo: 'LOT-20250615-001', receivedDate: '2025-06-15', dayAging: 2 },
  { id: '4', productId: '2', productName: 'ทุเรียนชะนี', gradeId: '2', gradeName: 'เกรด B', stockType: 'raw', quantity: 200, unitName: 'กก.', lotNo: 'LOT-20250616-002', receivedDate: '2025-06-16', dayAging: 1 },
  { id: '5', productId: '1', productName: 'ทุเรียนหมอนทอง', gradeId: '2', gradeName: 'เกรด B', stockType: 'packed', quantity: 30, unitName: 'กล่อง', lotNo: 'LOT-20250614-001', receivedDate: '2025-06-14', dayAging: 3 },
];
