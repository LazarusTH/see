import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PiggyBank,
  ArrowUpFromLine,
  Send,
  Search,
  LogOut,
  Home,
  Menu,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import TransactionModal from "@/components/user/TransactionModal";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Profile {
  balance: number;
  first_name: string;
  last_name: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'send';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  banks: { name: string };
}

const UserPortal = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal' | 'send' | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const { data: userProfile } = useQuery<Profile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, type, amount, status, created_at, 
          banks(name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Transaction[];
    },
  });

  // Generate chart data from transactions
  const chartData = transactions?.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    const existingData = acc.find(item => item.date === date);
    
    if (existingData) {
      if (transaction.type === 'deposit') {
        existingData.deposits = (existingData.deposits || 0) + transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        existingData.withdrawals = (existingData.withdrawals || 0) + transaction.amount;
      } else if (transaction.type === 'send') {
        existingData.sends = (existingData.sends || 0) + transaction.amount;
      }
    } else {
      acc.push({
        date,
        deposits: transaction.type === 'deposit' ? transaction.amount : 0,
        withdrawals: transaction.type === 'withdrawal' ? transaction.amount : 0,
        sends: transaction.type === 'send' ? transaction.amount : 0,
      });
    }
    
    return acc;
  }, [] as Array<{ date: string; deposits: number; withdrawals: number; sends: number }>).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  ) || [];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const handleTransactionClick = (type: 'deposit' | 'withdrawal' | 'send') => {
    setTransactionType(type);
    setIsMobileOpen(false);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);

    // Simulate AI response based on keywords
    let response = "I apologize, but I'm not sure how to help with that specific query. Could you please provide more details or rephrase your question?";

    const lowercaseMessage = chatMessage.toLowerCase();
    if (lowercaseMessage.includes('deposit')) {
      response = "To make a deposit, click the 'Deposit' button in the sidebar. You'll need to enter the amount and upload a receipt of your payment.";
    } else if (lowercaseMessage.includes('withdraw')) {
      response = "For withdrawals, select 'Withdraw' from the sidebar. Make sure you have sufficient balance and have added your bank account details.";
    } else if (lowercaseMessage.includes('send') || lowercaseMessage.includes('transfer')) {
      response = "To send money, use the 'Send' option in the sidebar. You'll need the recipient's email address and sufficient balance in your account.";
    } else if (lowercaseMessage.includes('balance')) {
      response = "Your current balance is shown at the top of the dashboard. It updates automatically after each approved transaction.";
    } else if (lowercaseMessage.includes('limit')) {
      response = "Transaction limits are set by administrators. Contact support if you need your limits adjusted.";
    }

    // Add AI response to chat history
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    // Clear input
    setChatMessage("");
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
        <button className="sidebar-link active">
          <Home className="h-5 w-5" />
          Overview
        </button>
        <button
          className="sidebar-link"
          onClick={() => handleTransactionClick('deposit')}
        >
          <PiggyBank className="h-5 w-5" />
          Deposit
        </button>
        <button
          className="sidebar-link"
          onClick={() => handleTransactionClick('withdrawal')}
        >
          <ArrowUpFromLine className="h-5 w-5" />
          Withdraw
        </button>
        <button
          className="sidebar-link"
          onClick={() => handleTransactionClick('send')}
        >
          <Send className="h-5 w-5" />
          Send
        </button>
        <button
          className="sidebar-link"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
          Support Chat
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Balance Card */}
          <Card className="stat-card">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome back, {userProfile?.first_name} {userProfile?.last_name}
            </h2>
            <p className="text-3xl font-bold text-white">
              ${userProfile?.balance?.toFixed(2) || '0.00'}
            </p>
            <p className="text-gray-400">Available Balance</p>
          </Card>

          {/* Transaction Chart */}
          <Card className="stat-card">
            <h3 className="text-xl font-semibold text-white mb-6">Transaction Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748B"
                    tick={{ fill: '#64748B' }}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fill: '#64748B' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="deposits"
                    name="Deposits"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    name="Withdrawals"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sends"
                    name="Sends"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="stat-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            </div>
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 rounded-lg bg-[#1E293B]"
                >
                  <div>
                    <p className="font-medium text-white capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-400">
                      {transaction.banks?.name} • {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${transaction.amount.toFixed(2)}</p>
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction Modal */}
      {transactionType && (
        <TransactionModal
          isOpen={!!transactionType}
          onClose={() => setTransactionType(null)}
          type={transactionType}
          currentBalance={userProfile?.balance || 0}
        />
      )}

      {/* Support Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Support</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPortal;