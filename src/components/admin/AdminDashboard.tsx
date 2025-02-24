import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
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

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_stats");
      if (error) throw error;
      return data;
    },
  });

  const { data: transactionHistory } = useQuery({
    queryKey: ["transactionHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("type, amount, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process data for chart
      const chartData = data.reduce((acc, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing[curr.type] = (existing[curr.type] || 0) + curr.amount;
        } else {
          acc.push({
            date,
            deposit: curr.type === 'deposit' ? curr.amount : 0,
            withdrawal: curr.type === 'withdrawal' ? curr.amount : 0,
            send: curr.type === 'send' ? curr.amount : 0,
          });
        }
        return acc;
      }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return chartData;
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
          <p className="text-2xl font-bold">{stats?.total_transactions || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Fees</h3>
          <p className="text-2xl font-bold">${stats?.total_fees?.toFixed(2) || "0.00"}</p>
        </Card>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Deposits</h3>
          <p className="text-2xl font-bold">${stats?.total_deposits?.toFixed(2) || "0.00"}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Withdrawals</h3>
          <p className="text-2xl font-bold">${stats?.total_withdrawals?.toFixed(2) || "0.00"}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Sent</h3>
          <p className="text-2xl font-bold">${stats?.total_sent?.toFixed(2) || "0.00"}</p>
        </Card>
      </div>

      {/* Transaction Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionHistory}>
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
                dataKey="deposit"
                name="Deposits"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="withdrawal"
                name="Withdrawals"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="send"
                name="Sends"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;