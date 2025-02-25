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
    bankId: "", // For withdrawals
    accountHolderName: "", // For withdrawals
    accountNumber: "", // For withdrawals
    recipientEmail: "", // For sends
    receipt: null, // For deposits
    fullName: "", // For deposits
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

  // Fetch assigned bank names for the user
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

  // Calculate fee based on the entered amount
  const calculateFee = (amount) => {
    if (fees.fee_type === "percentage") {
      return (amount * fees.fee_value) / 100;
    } else {
      return fees.fee_value;
    }
  };

  // Check if the transaction exceeds any limits
  const checkLimits = async (amount) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !userLimits) return;
    const limitPeriods = {
      daily: 24 * 60 * 60 * 1000, // 24 hours
      weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
      monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    for (const [period, duration] of Object.entries(limitPeriods)) {
      const limit = userLimits[`${period}_limit`];
      if (!limit) continue; // Skip if no limit is set for this period
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
        throw new Error(`Exceeds ${period} limit of $${limit}`);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

      // Check if the user has sufficient balance for withdrawals or sends
      if ((type === "withdrawal" || type === "send") && amount > currentBalance) {
        throw new Error("Insufficient balance");
      }

      // Check limits before proceeding
      if (TRANSACTION_TYPES[type]) await checkLimits(amount);

      // Calculate fee and total amount
      const fee = calculateFee(amount);
      const totalAmount = amount + fee;

      // Prepare transaction data
      const transactionData = {
        user_id: user.id,
        type,
        amount,
        fee,
        total_amount: totalAmount,
        bank_id: formData.bankId || null, // For withdrawals
        account_holder_name: formData.accountHolderName || null, // For withdrawals
        account_number: formData.accountNumber || null, // For withdrawals
        recipient_email: formData.recipientEmail || null, // For sends
        receipt_url: formData.receipt?.name || null, // For deposits
        full_name: formData.fullName || null, // For deposits
        status: "pending",
      };

      // Insert the transaction into the database
      const { error } = await supabase.from("transactions").insert(transactionData);
      if (error) throw error;

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({
        amount: "",
        bankId: "",
        accountHolderName: "",
        accountNumber: "",
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

  // Calculate fee and total amount dynamically
  const fee = calculateFee(parseFloat(formData.amount) || 0);
  const totalAmount = parseFloat(formData.amount) + fee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "deposit"
              ? "Make a Deposit"
              : type === "withdrawal"
              ? "Withdraw Funds"
              : "Send Money"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <Label>Amount</Label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          {/* Deposit-Specific Fields */}
          {type === "deposit" && (
            <>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Label>Upload Receipt</Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, receipt: file });
                  }
                }}
                required
              />
            </>
          )}

          {/* Withdrawal-Specific Fields */}
          {type === "withdrawal" && (
            <>
              <Label>Select Bank</Label>
              <Select
                value={formData.bankId}
                onValueChange={(value) => setFormData({ ...formData, bankId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {userBanks.map((bank) => (
                    <SelectItem key={bank.bank_id} value={bank.bank_id}>
                      {bank.bank_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Account Holder's Name</Label>
              <Input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
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
              <Label>Recipient Email</Label>
              <Input
                type="email"
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
