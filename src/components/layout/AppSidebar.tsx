import {
  Building2, GitBranch, Users, Package, Ruler, ShoppingCart, Star,
  Scissors, TreeDeciduous, UserCheck, BookOpen, LayoutDashboard,
  FileText, BarChart3, Receipt, Truck, BoxesIcon, Wallet, AlertTriangle,
  DollarSign, TrendingUp, LogOut, ChevronDown, ShieldCheck, UserCog, User
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, ROLE_LABELS, UserRole } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const masterMenuItems = [
  { title: 'สาขา', url: '/master/branch', icon: GitBranch },
  { title: 'แผนก', url: '/master/department', icon: Users },
  { title: 'กลุ่มสินค้า', url: '/master/product-group', icon: Package },
  { title: 'หน่วยนับ', url: '/master/unit', icon: Ruler },
  { title: 'สินค้า', url: '/master/product', icon: ShoppingCart },
  { title: 'เกรด', url: '/master/grade', icon: Star },
  { title: 'สายตัด', url: '/master/cutting-team', icon: Scissors },
  { title: 'ผู้จำหน่าย (สวน)', url: '/master/supplier', icon: TreeDeciduous },
  { title: 'ลูกค้า', url: '/master/customer', icon: UserCheck },
  { title: 'สมุดบัญชีเงินฝาก', url: '/master/bank-account', icon: BookOpen },
];

const transactionMenuItems = [
  { title: 'รับซื้อ', url: '/transaction/purchase', icon: Receipt },
  { title: 'สัญญาซื้อเหมาสวน', url: '/transaction/contract', icon: FileText },
  { title: 'จ่ายมัดจำล่วงหน้า', url: '/transaction/advance-payment', icon: Wallet },
  { title: 'แพ็คกิ้ง', url: '/transaction/packing', icon: BoxesIcon },
  { title: 'ขาย/ส่งออก', url: '/transaction/sales', icon: Truck },
  { title: 'รับมัดจำ (ลูกค้า)', url: '/transaction/deposit-receive', icon: DollarSign },
  { title: 'บันทึกค่าใช้จ่าย', url: '/transaction/expense', icon: Receipt },
  { title: 'คลังสินค้า', url: '/transaction/inventory', icon: BoxesIcon },
];

const dashboardMenuItems = [
  { title: 'ภาพรวมผู้บริหาร', url: '/dashboard/executive', icon: LayoutDashboard },
  { title: 'ฝ่ายรับซื้อ', url: '/dashboard/purchase', icon: TrendingUp },
  { title: 'ฝ่ายคัดเกรด', url: '/dashboard/grading', icon: Star },
  { title: 'คลังสินค้า', url: '/dashboard/warehouse', icon: BoxesIcon },
  { title: 'ฝ่ายขาย', url: '/dashboard/sales', icon: BarChart3 },
  { title: 'วิเคราะห์กำไร', url: '/dashboard/profit', icon: DollarSign },
  { title: 'แจ้งเตือน', url: '/dashboard/alerts', icon: AlertTriangle },
];

const adminMenuItems = [
  { title: 'บริษัท (ล้ง)', url: '/master/company', icon: Building2 },
  { title: 'จัดการผู้ใช้ / Role', url: '/admin/users', icon: UserCog },
];

const reportMenuItems = [
  { title: 'รายงานการเงิน', url: '/reports/finance', icon: BarChart3 },
];

// Roles that see everything (except admin section)
const fullAccessRoles: UserRole[] = ['owner', 'warehouse'];
// Roles that only see transactions
const transactionOnlyRoles: UserRole[] = ['finance', 'sales', 'grading', 'purchase'];

function MenuGroup({ label, items, defaultOpen = false }: { label: string; items: typeof masterMenuItems; defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer flex items-center justify-between text-sidebar-foreground/70 hover:text-sidebar-foreground text-xs uppercase tracking-wider font-semibold">
            {label}
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild size="sm">
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50 rounded-md transition-colors" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const role = user?.role;

  const isAdmin = role === 'admin';
  const isFullAccess = role && fullAccessRoles.includes(role);
  const isTransactionOnly = role && transactionOnlyRoles.includes(role);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            🍈
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-sidebar-foreground truncate">ล้งทุเรียน</span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate">{user?.companyName}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {/* หน้าหลัก - show for non-admin */}
        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="sm">
                    <NavLink to="/" end className="hover:bg-sidebar-accent/50 rounded-md" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>หน้าหลัก</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin section - admin only */}
        {isAdmin && (
          <MenuGroup label="ผู้ดูแลระบบ" items={adminMenuItems} defaultOpen />
        )}

        {/* ข้อมูลหลัก - owner, warehouse, manager */}
        {isFullAccess && (
          <MenuGroup label="ข้อมูลหลัก" items={masterMenuItems} defaultOpen />
        )}

        {/* เอกสาร - owner, warehouse, manager + transaction-only roles */}
        {(isFullAccess || isTransactionOnly) && (
          <MenuGroup label="เอกสาร" items={transactionMenuItems} defaultOpen={isTransactionOnly} />
        )}

        {/* Dashboard - owner, warehouse, manager only */}
        {isFullAccess && (
          <MenuGroup label="Dashboard" items={dashboardMenuItems} />
        )}

        {/* รายงาน - owner, warehouse, manager only */}
        {isFullAccess && (
          <MenuGroup label="รายงาน" items={reportMenuItems} />
        )}

        {/* โปรไฟล์ - all roles */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <NavLink to="/profile" end className="hover:bg-sidebar-accent/50 rounded-md" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <User className="h-4 w-4" />
                    <span>โปรไฟล์ / เปลี่ยนรหัสผ่าน</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</span>
            <span className="text-[10px] text-sidebar-foreground/60">{user?.role ? ROLE_LABELS[user.role] : ''}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
