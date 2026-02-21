import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '@/data/mockUsers';

export type UserRole = 'admin' | 'owner' | 'manager' | 'purchase' | 'grading' | 'warehouse' | 'sales' | 'finance';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'ผู้ดูแลระบบ',
  owner: 'เจ้าของ',
  manager: 'ผู้จัดการ',
  purchase: 'ฝ่ายรับซื้อ',
  grading: 'ฝ่ายคัดเกรด',
  warehouse: 'ฝ่ายคลัง',
  sales: 'ฝ่ายขาย',
  finance: 'การเงิน',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ACCOUNTS: User[] = [
  { id: '1', name: 'ผู้ดูแลระบบ', email: 'admin@durian.com', role: 'admin', companyId: '', companyName: '(ดูแลทุกบริษัท)' },
  { id: '2', name: 'สมชาย ทุเรียนทอง', email: 'owner@durian.com', role: 'owner', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด' },
  { id: '3', name: 'สมหญิง รับซื้อ', email: 'purchase@durian.com', role: 'purchase', companyId: 'C001', companyName: 'ล้งทุเรียนทอง จำกัด' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): { success: boolean; error?: string } => {
    // Check expiry from mockUsers data
    const mockUser = mockUsers.find(u => u.email === email);
    if (mockUser) {
      if (!mockUser.active) {
        return { success: false, error: 'บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ' };
      }
      if (!mockUser.noExpiry && mockUser.expiryDate) {
        if (new Date(mockUser.expiryDate) < new Date()) {
          return { success: false, error: `บัญชีหมดอายุเมื่อ ${mockUser.expiryDate} กรุณาติดต่อผู้ดูแลระบบ` };
        }
      }
    }

    const found = MOCK_ACCOUNTS.find(u => u.email === email);
    if (found) {
      setUser(found);
      return { success: true };
    }
    // fallback: if email matches mockUsers but not MOCK_ACCOUNTS
    if (mockUser) {
      setUser({ id: mockUser.id, name: mockUser.name, email: mockUser.email, role: mockUser.role, companyId: mockUser.companyId, companyName: mockUser.companyName });
      return { success: true };
    }
    setUser(MOCK_ACCOUNTS[0]);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
