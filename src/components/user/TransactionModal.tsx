import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emailTemplates } from "@/lib/emailService";
import { sendEmail } from "@/lib/emailService";

const TRANSACTION_TYPES = { withdrawal: "withdrawal", send: "send", deposit: "deposit" };

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  currentBalance: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type, currentBalance }) => {
  const [formData, setFormData] = useState({
    amount: "",
    bankId: "",
    recipientEmail: "",
    accountHolderName: "",
    accountNumber: "",
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

  const calculateFee = (amount: number) => {
    if (fees.fee_type === "percentage") {
      return (amount * fees.fee_value) / 100;
    } else {
      return fees.fee_value;
    }
  };

  const checkLimits = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !userLimits) return;

    const limitPeriods = {
      daily: 24 * 60 * 60 * 1000, // 24 hours
      weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
      monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
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

  const updateBalance = async (userId: string, amount: number, action: 'deduct' | 'add') => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      // For send transactions, verify recipient exists
      let recipientProfile;
      if (type === "send" && formData.recipientEmail) {
        const { data: recipient, error: recipientError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .eq("email", formData.recipientEmail)
          .single();

        if (recipientError || !recipient) throw new Error("Recipient does not exist");
        recipientProfile = recipient;
      }

      // Upload receipt if it's a deposit
      let receiptUrl = null;
      if (type === "deposit" && formData.receipt) {
        const { data, error: uploadError } = await supabase.storage
          .from("deposit-reciepts")
          .upload(formData.receipt.name, formData.receipt); // Upload directly to the bucket

        if (uploadError) throw new Error("Error uploading receipt");

        receiptUrl = data?.path;
      }

      const transactionData = {
        user_id: user.id,
        type,
        amount,
        fee,
        total_amount: totalAmount,
        bank_id: formData.bankId || null,
        recipient_email: formData.recipientEmail || null,
        receipt_url: receiptUrl || null,
        full_name: formData.fullName || null,
        account_holder_name: formData.accountHolderName || null,
        account_number: formData.accountNumber || null,
        status: "pending",
      };

      const { error } = await supabase.from("transactions").insert(transactionData);
      if (error) throw error;

      // Deduct or Add balance based on transaction type
      if (type === "deposit") {
        await updateBalance(user.id, amount, "add");
      } else if (type === "withdrawal" || type === "send") {
        await updateBalance(user.id, totalAmount, "deduct");
      }

      // Example for send transaction emails
      const sendEmailWithFallback = async (emailData) => {
        const { success, error } = await sendEmail(emailData);
        if (!success) {
          console.error('Failed to send email:', error);
          toast.error('Transaction successful but notification email failed to send');
        }
      };

      // Then replace direct email sends with this wrapper
      if (type === "send" && recipientProfile) {
        await sendEmailWithFallback({
          to: user.email,
          ...emailTemplates.transactionConfirmation(
            `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
            amount,
            formData.recipientEmail
          )
        });

        // Send notification to recipient
        await sendEmailWithFallback({
          to: formData.recipientEmail,
          ...emailTemplates.moneyReceived(
            `${recipientProfile.first_name} ${recipientProfile.last_name}`,
            amount,
            user.email
          )
        });
      }

      if (type === "withdrawal") {
        // Send confirmation to user
        await sendEmailWithFallback({
          to: user.email,
          ...emailTemplates.withdrawalRequest(
            `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
            amount,
            userBanks.find(bank => bank.bank_id === formData.bankId)?.bank_name || 'Selected Bank'
          )
        });

        // Send notification to admin
        const { data: adminUsers, error: adminError } = await supabase
          .from('user_roles')
          .select('profiles(email, first_name, last_name)')
          .eq('role', 'admin');

        if (!adminError && adminUsers) {
          for (const admin of adminUsers) {
            await sendEmailWithFallback({
              to: admin.profiles.email,
              ...emailTemplates.adminWithdrawalNotification(
                `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
                amount,
                userBanks.find(bank => bank.bank_id === formData.bankId)?.bank_name || 'Selected Bank'
              )
            });
          }
        }
      }

      if (type === "deposit") {
        // Get receipt URL if uploaded
        let publicReceiptUrl = null;
        if (receiptUrl) {
          const { data: urlData } = supabase.storage
            .from("deposit-reciepts")
            .getPublicUrl(receiptUrl);
          publicReceiptUrl = urlData.publicUrl;
        }

        // Notify admins of new deposit
        const { data: adminUsers, error: adminError } = await supabase
          .from('user_roles')
          .select('profiles(email, first_name, last_name)')
          .eq('role', 'admin');

        if (!adminError && adminUsers) {
          for (const admin of adminUsers) {
            await sendEmailWithFallback({
              to: admin.profiles.email,
              ...emailTemplates.adminDepositNotification(
                `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
                amount,
                publicReceiptUrl
              )
            });
          }
        }
      }

      toast.success("Transaction submitted successfully");
      onClose();
      setFormData({
        amount: "",
        bankId: "",
        recipientEmail: "",
        accountHolderName: "",
        accountNumber: "",
        receipt: null,
        fullName: "",
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
          {/* Common Amount Field */}
          <Label>Amount</Label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          {/* Deposit Form */}
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

          {/* Withdrawal Form */}
          {type === "withdrawal" && (
            <>
              <Label>Choose Bank</Label>
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

          {/* Send Form */}
          {type === "send" && (
            <>
              <Label>Receiver Email</Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                required
              />
            </>
          )}

          {/* Fee Information */}
          <div className="space-y-2">
            <Label>Fee</Label>
            <div className="text-sm text-gray-600">
              {fees.fee_type === "percentage" ? `${fees.fee_value}%` : `$${fees.fee_value}`}
            </div>
            <div className="text-sm text-gray-600">Fee Amount: ${fee.toFixed(2)}</div>
          </div>

          {/* Total Amount */}
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
