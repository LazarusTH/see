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
    bankId: "", // Store the selected bank ID
    recipientEmail: "",
    receipt: null,
    fullName: "", // For deposit requests
    accountNumber: "", // For withdrawal
    accountHolderName: "", // For withdrawal
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
        .eq("profile_id", user.id)
        .eq("transaction_type", transactionType)
        .single();

      const { data: feesData, error: feesError } = await supabase
        .from("fees")
        .select("fee_type, fee_value")
        .eq("profile_id", user.id)
        .eq("transaction_type", transactionType)
        .single();

      if (limitsError || feesError) throw limitsError || feesError;

      setFees(feesData || { fee_type: "percentage", fee_value: 0 });
      return limitsData;
    },
    enabled: isOpen && !!TRANSACTION_TYPES[type], // Ensure this is a boolean
  });

  // Fetch assigned bank names for the user
  const { data: userBanks = [] } = useQuery({
    queryKey: ["userBanks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Join user_banks with banks to get bank names
      const { data, error } = await supabase
        .from("user_banks")
        .select("bank_id, banks(name)")
        .eq("profile_id", user.id);

      if (error) throw error;

      return data.map((item) => ({
        bank_id: item.bank_id,
        bank_name: item.banks.name,
      }));
    },
    enabled: isOpen && type === "withdrawal", // Fetch only for withdrawal requests
  });

  const calculateFee = (amount) => {
    if (fees.fee_type === "percentage") {
      return (amount * fees.fee_value) / 100;
    } else {
      return fees.fee_value;
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

      const fee = calculateFee(amount);
      const totalAmount = amount + fee;

      // Prepare transaction data
      const transactionData = {
        profile_id: user.id,
        type,
        amount,
        fee,
        total_amount: totalAmount,
        bank_id: formData.bankId || null, // Include the selected bank ID for withdrawal
        recipient_email: formData.recipientEmail || null, // For send money
        receipt_url: formData.receipt || null, // For deposit
        account_number: formData.accountNumber || null, // For withdrawal
        account_holder_name: formData.accountHolderName || null, // For withdrawal
        status: "pending", // Initially set status to pending
      };

      const { error } = await supabase.from("transactions").insert(transactionData);
      if (error) throw error;

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({
        amount: "",
        bankId: "",
        recipientEmail: "",
        receipt: null,
        fullName: "",
        accountNumber: "",
        accountHolderName: "",
      });
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
          <DialogTitle>{type === "deposit" ? "Make a Deposit" : type === "withdrawal" ? "Withdraw Funds" : "Send Money"}</DialogTitle>
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

          {/* Send Money Specific Fields */}
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
