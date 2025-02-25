import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TRANSACTION_TYPES = { withdrawal: "withdrawal", send: "sending", deposit: "deposit" };

const TransactionModal = ({ isOpen, onClose, type, currentBalance }) => {
  const [formData, setFormData] = useState({
    amount: "",
    bankId: "", 
    recipientEmail: "",
    receipt: null,
    fullName: "", 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fees, setFees] = useState({ fee_type: "percentage", fee_value: 0 });

  const { data: userLimits } = useQuery({
    queryKey: ["userLimits", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const transactionType = TRANSACTION_TYPES[type];
      const { data: limitsData, error: limitsError } = await supabase
        .from("user_limits")
        .select("daily_limit, weekly_limit, monthly_limit, limit_created_at")
        .eq("user_id", user.id)
        .eq("transaction_type", transactionType)
        .single();

      const { data: feesData, error: feesError } = await supabase
        .from("fees")
        .select("fee_type, fee_value")
        .eq("user_id", user.id)
        .eq("transaction_type", transactionType)
        .single();

      if (limitsError || feesError) throw limitsError || feesError;

      setFees(feesData || { fee_type: "percentage", fee_value: 0 });
      return limitsData;
    },
    enabled: isOpen && !!TRANSACTION_TYPES[type], 
  });

  const { data: userBanks = [] } = useQuery({
    queryKey: ["userBanks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_banks")
        .select("bank_id, banks(name)")
        .eq("user_id", user.id);

      if (error) throw error;

      return data.map((item) => ({
        bank_id: item.bank_id,
        bank_name: item.banks.name,
      }));
    },
    enabled: isOpen && type === "withdrawal", 
  });

  const calculateFee = (amount) => {
    return fees.fee_type === "percentage" ? (amount * fees.fee_value) / 100 : fees.fee_value;
  };

  const checkLimits = async (amount) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !userLimits) return;

    const limitPeriods = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };

    for (const [period, duration] of Object.entries(limitPeriods)) {
      const limit = userLimits[`${period}_limit`];
      if (!limit) continue;

      const limitStart = new Date(userLimits.limit_created_at);
      const limitEnd = new Date(limitStart.getTime() + duration);

      const { data, error } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .eq("user_id", user.id)
        .eq("type", type)
        .eq("status", "approved")
        .gte("created_at", limitStart.toISOString())
        .lte("created_at", limitEnd.toISOString());

      if (error) throw error;

      const totalSpent = data.reduce((sum, tx) => sum + tx.amount, 0);

      if (totalSpent + amount > limit) {
        throw new Error(`Exceeds ${period} limit of ${limit}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
      if ((type === "withdrawal" || type === "send") && amount > currentBalance) {
        throw new Error("Insufficient balance");
      }

      if (TRANSACTION_TYPES[type]) await checkLimits(amount);

      const fee = calculateFee(amount);
      const totalAmount = amount + fee;

      const transactionData = {
        user_id: user.id,
        type,
        amount,
        fee,
        total_amount: totalAmount,
        bank_id: formData.bankId || null,
        recipient_email: formData.recipientEmail || null,
        receipt_url: formData.receipt || null,
        full_name: formData.fullName || null,
        status: "pending",
      };

      const { error } = await supabase.from("transactions").insert(transactionData);
      if (error) throw error;

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({ amount: "", bankId: "", recipientEmail: "", receipt: null, fullName: "" });
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
          <DialogTitle>{type === "deposit" ? "Make a Deposit" : type === "withdrawal" ? "Withdraw Funds" : "Send Money"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Amount</Label>
          <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? "Processing..." : "Submit"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
