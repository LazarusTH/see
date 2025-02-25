import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const TRANSACTION_TYPES = { withdrawal: "withdrawal", send: "send", deposit: "deposit" };

const TransactionModal = ({ isOpen, onClose, type, currentBalance, onBalanceUpdate }) => {
  const [formData, setFormData] = useState({
    amount: "",
    bankId: "",
    accountNumber: "",
    accountHolder: "",
    recipientEmail: "",
    receipt: null,
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fees, setFees] = useState({ fee_type: "percentage", fee_value: 0 });

  // Fetch user limits and fees
  const { data: userLimits } = useQuery({
    queryKey: ["userLimits", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: limitsData } = await supabase
        .from("user_limits")
        .select("daily_limit, weekly_limit, monthly_limit")
        .eq("user_id", user.id)
        .eq("transaction_type", TRANSACTION_TYPES[type])
        .single();

      const { data: feesData } = await supabase
        .from("fees")
        .select("fee_type, fee_value")
        .eq("user_id", user.id)
        .eq("transaction_type", TRANSACTION_TYPES[type])
        .single();

      setFees(feesData || { fee_type: "percentage", fee_value: 0 });
      return limitsData;
    },
    enabled: isOpen && !!TRANSACTION_TYPES[type],
  });

  const calculateFee = (amount) => {
    return fees.fee_type === "percentage" ? (amount * fees.fee_value) / 100 : fees.fee_value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

      const fee = calculateFee(amount);
      const totalAmount = amount + fee;

      // Check if the transaction exceeds the current balance
      if ((type === "withdrawal" || type === "send") && totalAmount > currentBalance) {
        throw new Error("Insufficient balance");
      }

      // Check transaction limits
      const { daily_limit, weekly_limit, monthly_limit } = userLimits || {};
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, created_at, status")
        .eq("user_id", user.id)
        .eq("type", type);

      const now = new Date();
      const dailyTotal = transactions
        .filter((t) => new Date(t.created_at) > new Date(now.setHours(0, 0, 0, 0)))
        .reduce((sum, t) => sum + t.amount, 0);

      const weeklyTotal = transactions
        .filter((t) => new Date(t.created_at) > new Date(now.setDate(now.getDate() - 7)))
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyTotal = transactions
        .filter((t) => new Date(t.created_at) > new Date(now.setMonth(now.getMonth() - 1)))
        .reduce((sum, t) => sum + t.amount, 0);

      if (daily_limit && dailyTotal + amount > daily_limit) throw new Error("Daily limit exceeded");
      if (weekly_limit && weeklyTotal + amount > weekly_limit) throw new Error("Weekly limit exceeded");
      if (monthly_limit && monthlyTotal + amount > monthly_limit) throw new Error("Monthly limit exceeded");

      // Deduct balance for withdrawal and send transactions
      if (type === "withdrawal" || type === "send") {
        const { error: balanceError } = await supabase.rpc("update_user_balance", {
  p_amount: -totalAmount, 
  p_transaction_type: type, 
  p_user_id: user.id
});

        if (balanceError) throw balanceError;
        onBalanceUpdate(currentBalance - totalAmount);
      }

      // Insert transaction
      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type,
          amount,
          fee,
          total_amount: totalAmount,
          bank_id: formData.bankId || null,
          recipient_email: formData.recipientEmail || null,
          account_holder: formData.accountHolder || null,
          account_number: formData.accountNumber || null,
          receipt_url: formData.receipt || null,
          full_name: formData.fullName || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Transaction submitted successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fee = calculateFee(parseFloat(formData.amount) || 0);
  const totalAmount = parseFloat(formData.amount) + fee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "deposit" ? "Make a Deposit" : type === "withdrawal" ? "Withdraw Funds" : "Send Money"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Amount</Label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          {/* Withdrawal-Specific Fields */}
          {type === "withdrawal" && (
            <>
              <Label>Account Holder's Name</Label>
              <Input
                type="text"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                required
              />
              <Label>Account Number</Label>
              <Input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </>
          )}

          {/* Send-Specific Fields */}
          {type === "send" && (
            <>
              <Label>Recipient Username/Email</Label>
              <Input
                type="text"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                required
              />
            </>
          )}

          {/* Fee and Total Amount Display */}
          <div className="space-y-2">
            <Label>Fee</Label>
            <div className="text-sm text-gray-600">
              {fees.fee_type === "percentage" ? `${fees.fee_value}%` : `$${fees.fee_value}`}
            </div>
            <div className="text-sm text-gray-600">Fee Amount: ${fee.toFixed(2)}</div>
          </div>
          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="text-sm text-gray-600">${totalAmount.toFixed(2)}</div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
