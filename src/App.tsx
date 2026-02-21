import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

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

// Transactions
import PurchasePage from "./pages/transaction/PurchasePage";
import ContractPage from "./pages/transaction/ContractPage";
import AdvancePaymentPage from "./pages/transaction/AdvancePaymentPage";
import PackingPage from "./pages/transaction/PackingPage";
import SalesPage from "./pages/transaction/SalesPage";
import DepositReceivePage from "./pages/transaction/DepositReceivePage";
import ExpensePage from "./pages/transaction/ExpensePage";
import InventoryPage from "./pages/transaction/InventoryPage";

// Dashboards
import ExecutiveDashboard from "./pages/dashboard/ExecutiveDashboard";
import PurchaseDashboard from "./pages/dashboard/PurchaseDashboard";
import GradingDashboard from "./pages/dashboard/GradingDashboard";
import WarehouseDashboard from "./pages/dashboard/WarehouseDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import ProfitDashboard from "./pages/dashboard/ProfitDashboard";
import AlertsDashboard from "./pages/dashboard/AlertsDashboard";
import FinanceReport from "./pages/reports/FinanceReport";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import UserManagementPage from "./pages/admin/UserManagementPage";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Admin */}
        <Route path="/admin/overview" element={<AdminOverviewPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />

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
        <Route path="/transaction/purchase" element={<PurchasePage />} />
        <Route path="/transaction/contract" element={<ContractPage />} />
        <Route path="/transaction/advance-payment" element={<AdvancePaymentPage />} />
        <Route path="/transaction/packing" element={<PackingPage />} />
        <Route path="/transaction/sales" element={<SalesPage />} />
        <Route path="/transaction/deposit-receive" element={<DepositReceivePage />} />
        <Route path="/transaction/expense" element={<ExpensePage />} />
        <Route path="/transaction/inventory" element={<InventoryPage />} />

        {/* Dashboards */}
        <Route path="/dashboard/executive" element={<ExecutiveDashboard />} />
        <Route path="/dashboard/purchase" element={<PurchaseDashboard />} />
        <Route path="/dashboard/grading" element={<GradingDashboard />} />
        <Route path="/dashboard/warehouse" element={<WarehouseDashboard />} />
        <Route path="/dashboard/sales" element={<SalesDashboard />} />
        <Route path="/dashboard/profit" element={<ProfitDashboard />} />
        <Route path="/dashboard/alerts" element={<AlertsDashboard />} />

        {/* Reports */}
        <Route path="/reports/finance" element={<FinanceReport />} />

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
