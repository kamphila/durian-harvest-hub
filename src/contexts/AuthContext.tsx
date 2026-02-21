import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'ผู้ดูแลระบบ',
  email: 'admin@durian.com',
  role: 'admin',
  companyId: '',
  companyName: '(ดูแลทุกบริษัท)',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    // Mock login
    setUser(MOCK_USER);
    return true;
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
