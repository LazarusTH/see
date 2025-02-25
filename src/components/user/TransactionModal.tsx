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
    accountNumber: "",
    accountHolder: "",
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
      
      if ((type === "withdrawal" || type === "send") && totalAmount > currentBalance) {
        throw new Error("Insufficient balance");
      }
      
      // Update profile balance
      if (type === "deposit") {
        await supabase.rpc("update_balance", { user_id: user.id, amount: amount });
      } else if (type === "withdrawal" || type === "send") {
        await supabase.rpc("update_balance", { user_id: user.id, amount: -totalAmount });
      }

      // Insert transaction
      await supabase.from("transactions").insert({
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
      });
      
      toast.success("Transaction submitted successfully");
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
          <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          {type === "deposit" && (
            <>
              <Label>Full Name</Label>
              <Input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
              <Label>Upload Receipt</Label>
              <Input type="file" onChange={(e) => setFormData({ ...formData, receipt: e.target.files[0] })} required />
            </>
          )}
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
