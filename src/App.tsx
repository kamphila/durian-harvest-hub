import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

// Master Data
import CompanyPage from "./pages/master/CompanyPage";
import BranchPage from "./pages/master/BranchPage";
import DepartmentPage from "./pages/master/DepartmentPage";
import ProductGroupPage from "./pages/master/ProductGroupPage";
import UnitPage from "./pages/master/UnitPage";
import ProductPage from "./pages/master/ProductPage";
import GradePage from "./pages/master/GradePage";
import CuttingTeamPage from "./pages/master/CuttingTeamPage";
import SupplierPage from "./pages/master/SupplierPage";
import CustomerPage from "./pages/master/CustomerPage";
import BankAccountPage from "./pages/master/BankAccountPage";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Master Data */}
        <Route path="/master/company" element={<CompanyPage />} />
        <Route path="/master/branch" element={<BranchPage />} />
        <Route path="/master/department" element={<DepartmentPage />} />
        <Route path="/master/product-group" element={<ProductGroupPage />} />
        <Route path="/master/unit" element={<UnitPage />} />
        <Route path="/master/product" element={<ProductPage />} />
        <Route path="/master/grade" element={<GradePage />} />
        <Route path="/master/cutting-team" element={<CuttingTeamPage />} />
        <Route path="/master/supplier" element={<SupplierPage />} />
        <Route path="/master/customer" element={<CustomerPage />} />
        <Route path="/master/bank-account" element={<BankAccountPage />} />

        {/* Transactions */}
        <Route path="/transaction/purchase" element={<PlaceholderPage title="รับซื้อ" />} />
        <Route path="/transaction/contract" element={<PlaceholderPage title="สัญญาซื้อเหมาสวน" />} />
        <Route path="/transaction/advance-payment" element={<PlaceholderPage title="จ่ายมัดจำล่วงหน้า" />} />
        <Route path="/transaction/packing" element={<PlaceholderPage title="แพ็คกิ้ง" />} />
        <Route path="/transaction/sales" element={<PlaceholderPage title="ขาย/ส่งออก" />} />
        <Route path="/transaction/deposit-receive" element={<PlaceholderPage title="รับมัดจำ (ลูกค้า)" />} />
        <Route path="/transaction/expense" element={<PlaceholderPage title="บันทึกค่าใช้จ่าย" />} />
        <Route path="/transaction/inventory" element={<PlaceholderPage title="คลังสินค้า" />} />

        {/* Dashboards */}
        <Route path="/dashboard/executive" element={<PlaceholderPage title="Dashboard ผู้บริหาร" />} />
        <Route path="/dashboard/purchase" element={<PlaceholderPage title="Dashboard ฝ่ายรับซื้อ" />} />
        <Route path="/dashboard/grading" element={<PlaceholderPage title="Dashboard ฝ่ายคัดเกรด" />} />
        <Route path="/dashboard/warehouse" element={<PlaceholderPage title="Dashboard คลังสินค้า" />} />
        <Route path="/dashboard/sales" element={<PlaceholderPage title="Dashboard ฝ่ายขาย" />} />
        <Route path="/dashboard/profit" element={<PlaceholderPage title="Dashboard วิเคราะห์กำไร" />} />
        <Route path="/dashboard/alerts" element={<PlaceholderPage title="ระบบแจ้งเตือน" />} />

        {/* Reports */}
        <Route path="/reports/finance" element={<PlaceholderPage title="รายงานการเงิน" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
