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
    accountNumber: "", // Added for withdrawal
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fees, setFees] = useState({ fee_type: "percentage", fee_value: 0 });

  const checkLimits = async (amount) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: limits, error } = await supabase
      .from("user_limits")
      .select("daily_limit, weekly_limit, monthly_limit")
      .eq("user_id", user.id)
      .eq("transaction_type", type)
      .single();

    if (error) throw new Error("Unable to fetch transaction limits");

    const limitChecks = [
      { period: "daily", limit: limits.daily_limit, duration: 24 * 60 * 60 * 1000 },
      { period: "weekly", limit: limits.weekly_limit, duration: 7 * 24 * 60 * 60 * 1000 },
      { period: "monthly", limit: limits.monthly_limit, duration: 30 * 24 * 60 * 60 * 1000 },
    ];

    for (const { period, limit, duration } of limitChecks) {
      if (!limit) continue;
      const startTime = new Date(Date.now() - duration).toISOString();
      
      const { data, error } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("type", type)
        .eq("status", "approved")
        .gte("created_at", startTime);
      
      if (error) throw error;
      const totalSpent = data.reduce((sum, tx) => sum + tx.amount, 0);
      
      if (totalSpent + amount > limit) {
        throw new Error(`Exceeds ${period} limit of ${limit}`);
      }
    }
  };

  const updateBalance = async (userId, amount, action) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error) throw new Error("Unable to fetch user balance");

    let newBalance = data.balance;
    if (action === "deduct") {
      newBalance -= amount;
    } else if (action === "add") {
      newBalance += amount;
    }

    const { updateError } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) throw new Error("Unable to update user balance");
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

      await checkLimits(amount);

      const fee = (fees.fee_type === "percentage" ? (amount * fees.fee_value) / 100 : fees.fee_value);
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
        account_number: formData.accountNumber || null,
        status: "pending",
      };

      const { error } = await supabase.from("transactions").insert(transactionData);
      if (error) throw error;

      if (type === "deposit") {
        await updateBalance(user.id, amount, "add");
      } else if (type === "withdrawal" || type === "send") {
        await updateBalance(user.id, totalAmount, "deduct");
      }

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({ amount: "", bankId: "", recipientEmail: "", receipt: null, fullName: "", accountNumber: "" });
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
          {type === "send" && (
            <>
              <Label>Recipient Email</Label>
              <Input type="email" value={formData.recipientEmail} onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })} required />
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
