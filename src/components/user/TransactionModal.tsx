import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TRANSACTION_TYPES = { withdrawal: "withdrawal", send: "send", deposit: "deposit" };

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

  // Fetch user limits and fees
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
    if (fees.fee_type === "percentage") {
      return (amount * fees.fee_value) / 100;
    } else {
      return fees.fee_value;
    }
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

  const updateBalance = async (userId, amount) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error) throw new Error("Unable to fetch user balance");

    const newBalance = data.balance + amount;

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

      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;

      if (type === "withdrawal" || type === "send") {
        await updateBalance(user.id, -totalAmount); // Deduct the total amount (amount + fee)
      }

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({
        amount: "",
        bankId: "",
        recipientEmail: "",
        receipt: null,
        fullName: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTransaction = async (transactionId, userId, amount, fee) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status: "rejected" })
        .eq("id", transactionId);

      if (error) throw new Error("Unable to update transaction status to rejected");

      await updateBalance(userId, amount + fee); // Refund the amount and fee
      toast.success("Transaction rejected and balance refunded.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fee = calculateFee(parseFloat(formData.amount) || 0);
  const totalAmount = parseFloat(formData.amount) + fee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "deposit" ? "Make a Deposit" : type === "withdrawal" ? "Withdraw Funds" : "Send Money"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Amount</Label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          {type === "deposit" && (
            <>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </>
          )}

          {type === "withdrawal" && (
            <>
              <Label>Bank</Label>
              <Select
                value={formData.bankId}
                onValueChange={(value) => setFormData({ ...formData, bankId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {userBanks.map((bank) => (
                    <SelectItem key={bank.bank_id} value={bank.bank_id}>
                      {bank.bank_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {type === "send" && (
            <>
              <Label>Recipient Email</Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                required
              />
            </>
          )}

          <div>
            <Label>Total Amount (Including Fee):</Label>
            <div>{totalAmount}</div>
          </div>

          <div className="flex justify-between items-center">
            <Button type="submit" isLoading={isLoading}>
              Submit
            </Button>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
