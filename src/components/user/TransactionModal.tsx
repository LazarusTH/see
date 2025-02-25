import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const TRANSACTION_TYPES = { withdrawal: "withdrawal", send: "sending", deposit: "deposit" };

const TransactionModal = ({ isOpen, onClose, type, currentBalance }) => {
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
  const [totalAmount, setTotalAmount] = useState(0);

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

      return limitsData;
    },
    enabled: isOpen && !!TRANSACTION_TYPES[type],
  });

  // Ensure fee is recalculated when amount or fee value changes
  useEffect(() => {
    if (formData.amount) {
      const amount = parseFloat(formData.amount);
      const fee = calculateFee(amount);
      setTotalAmount(amount + fee);
    }
  }, [formData.amount, fees.fee_value]);

  const calculateFee = (amount) => {
    if (fees.fee_type === "percentage" && fees.fee_value > 0) {
      return (amount * fees.fee_value) / 100;
    } else if (fees.fee_value > 0) {
      return fees.fee_value;
    }
    return 0;
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setFormData({ ...formData, amount });
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
      const dailyTotal = transactions.filter(t => new Date(t.created_at) > new Date(now.setHours(0, 0, 0, 0)))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const weeklyTotal = transactions.filter(t => new Date(t.created_at) > new Date(now.setDate(now.getDate() - 7)))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyTotal = transactions.filter(t => new Date(t.created_at) > new Date(now.setMonth(now.getMonth() - 1)))
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (daily_limit && dailyTotal + amount > daily_limit) throw new Error("Daily limit exceeded");
      if (weekly_limit && weeklyTotal + amount > weekly_limit) throw new Error("Weekly limit exceeded");
      if (monthly_limit && monthlyTotal + amount > monthly_limit) throw new Error("Monthly limit exceeded");

      // Update balance (with deduction for withdrawal/send)
      if (type === "deposit") {
        await supabase.rpc("update_balance", { user_id: user.id, amount: amount });
      } else if (type === "withdrawal" || type === "send") {
        await supabase.rpc("update_balance", { user_id: user.id, amount: -totalAmount });
      }

      // Insert transaction (mark as pending)
      const transaction = await supabase.from("transactions").insert({
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
        status: "pending", // pending status until it's approved or rejected
      }).single();

      toast.success("Transaction submitted successfully");

      // Close the modal
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Input type="number" value={formData.amount} onChange={handleAmountChange} required />
          <div>
            <p>Fee: {fees.fee_type === "percentage" ? `${fees.fee_value}%` : `${fees.fee_value} units`}</p>
            <p>Total Amount (Including Fee): {totalAmount}</p>
          </div>
          {type === "withdrawal" && (
            <>
              <Label>Account Holder's Name</Label>
              <Input type="text" value={formData.accountHolder} onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })} required />
              <Label>Account Number</Label>
              <Input type="text" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} required />
            </>
          )}
          {type === "send" && (
            <>
              <Label>Recipient Username/Email</Label>
              <Input type="text" value={formData.recipientEmail} onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })} required />
            </>
          )}
          {type === "deposit" && (
            <>
              <Label>Upload Receipt</Label>
              <Input type="file" onChange={(e) => setFormData({ ...formData, receipt: e.target.files[0] })} />
            </>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
