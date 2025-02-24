import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  LayoutDashboard,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import UserManagement from "@/components/admin/UserManagement";
import BankManagement from "@/components/admin/BankManagement";
import TransactionManagement from "@/components/admin/TransactionManagement";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<
    'dashboard' | 'users' | 'banks' | 'deposits' | 'withdrawals' | 'sends'
  >('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || roleData?.role !== 'admin') {
        navigate('/portal');
      }
    };

    checkAdminRole();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'banks':
        return <BankManagement />;
      case 'deposits':
        return <TransactionManagement type="deposit" />;
      case 'withdrawals':
        return <TransactionManagement type="withdrawal" />;
      case 'sends':
        return <TransactionManagement type="send" />;
      default:
        return <AdminDashboard />;
    }
  };

  const SidebarContent = () => (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">CASHORA</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-[#1E293B] border-none"
          />
        </div>
      </div>

      <nav className="space-y-2">
        <button
          className={`sidebar-link ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleViewChange('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>
        <button
          className={`sidebar-link ${activeView === 'users' ? 'active' : ''}`}
          onClick={() => handleViewChange('users')}
        >
          <Users className="h-5 w-5" />
          Users
        </button>
        <button
          className={`sidebar-link ${activeView === 'banks' ? 'active' : ''}`}
          onClick={() => handleViewChange('banks')}
        >
          <Building2 className="h-5 w-5" />
          Banks
        </button>
        <button
          className={`sidebar-link ${activeView === 'deposits' ? 'active' : ''}`}
          onClick={() => handleViewChange('deposits')}
        >
          <ArrowDownToLine className="h-5 w-5" />
          Deposits
        </button>
        <button
          className={`sidebar-link ${activeView === 'withdrawals' ? 'active' : ''}`}
          onClick={() => handleViewChange('withdrawals')}
        >
          <ArrowUpFromLine className="h-5 w-5" />
          Withdrawals
        </button>
        <button
          className={`sidebar-link ${activeView === 'sends' ? 'active' : ''}`}
          onClick={() => handleViewChange('sends')}
        >
          <Send className="h-5 w-5" />
          Sends
        </button>
      </nav>
    </ScrollArea>
  );

  return (
    <div className="flex h-screen bg-[#0A0F1C]">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-[#0E1527]">
            <div className="h-full relative p-6">
              <SidebarContent />
              <div className="absolute bottom-8 left-6 right-6">
                <button className="sidebar-link w-full" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block sidebar">
        <SidebarContent />
        <div className="absolute bottom-8 left-6 right-6">
          <button className="sidebar-link w-full" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPortal;