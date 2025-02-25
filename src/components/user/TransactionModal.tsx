import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!isOpen) setFormData({ amount: "", bankId: "", accountNumber: "", accountHolder: "", recipientEmail: "", receipt: null, fullName: "" });
  }, [isOpen]);

  const { data: userLimits } = useQuery({
    queryKey: ["userLimits", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const transactionType = TRANSACTION_TYPES[type];
      
      const { data: limitsData } = await supabase.from("user_limits").select("* ").eq("user_id", user.id).eq("transaction_type", transactionType).single();
      const { data: feesData } = await supabase.from("fees").select("fee_type, fee_value").eq("user_id", user.id).eq("transaction_type", transactionType).single();
      
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
      const { data } = await supabase.from("user_banks").select("bank_id, banks(name)").eq("user_id", user.id);
      return data.map((item) => ({ bank_id: item.bank_id, bank_name: item.banks.name }));
    },
    enabled: isOpen && type === "withdrawal",
  });

  const calculateFee = (amount) => fees.fee_type === "percentage" ? (amount * fees.fee_value) / 100 : fees.fee_value;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
      if ((type === "withdrawal" || type === "send") && amount > currentBalance) throw new Error("Insufficient balance");
      
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
      
      await supabase.from("transactions").insert(transactionData);
      if (type !== "deposit") {
        await supabase.from("users").update({ balance: currentBalance - totalAmount }).eq("id", user.id);
      }
      
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
          <DialogTitle>{type === "deposit" ? "Make a Deposit" : type === "withdrawal" ? "Withdraw Funds" : "Send Money"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Amount</Label>
          <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          
          {type === "deposit" && <>
            <Label>Full Name</Label>
            <Input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            <Label>Upload Receipt</Label>
            <Input type="file" onChange={(e) => setFormData({ ...formData, receipt: e.target.files[0] })} required />
          </>}
          
          {type === "withdrawal" && <>
            <Label>Select Bank</Label>
            <Select value={formData.bankId} onValueChange={(value) => setFormData({ ...formData, bankId: value })}>
              <SelectTrigger><SelectValue placeholder="Select a bank" /></SelectTrigger>
              <SelectContent>{userBanks.map(bank => <SelectItem key={bank.bank_id} value={bank.bank_id}>{bank.bank_name}</SelectItem>)}</SelectContent>
            </Select>
          </>}
          
          <Label>Fee: {fees.fee_type === "percentage" ? `${fees.fee_value}%` : `$${fees.fee_value}`}</Label>
          <Label>Total Amount: ${parseFloat(formData.amount || 0) + calculateFee(parseFloat(formData.amount || 0))}</Label>
          
          <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? "Processing..." : "Submit"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
