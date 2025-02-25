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
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [totalWithFees, setTotalWithFees] = useState(0);

  // Fetch transaction fees
  const { data: feeData } = useQuery({
    queryKey: ["fees", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fees")
        .select("fee_type, fee_value")
        .eq("transaction_type", TRANSACTION_TYPES[type])
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!TRANSACTION_TYPES[type],
  });

  // Set fees when data is loaded
  useEffect(() => {
    if (feeData) {
      setFees(feeData);
    }
  }, [feeData]);

  // Calculate transaction fee dynamically
  useEffect(() => {
    const amount = parseFloat(formData.amount);
    if (!isNaN(amount) && amount > 0) {
      const fee = fees.fee_type === "percentage" ? (amount * fees.fee_value) / 100 : fees.fee_value;
      setCalculatedFee(fee);
      setTotalWithFees(amount + fee);
    } else {
      setCalculatedFee(0);
      setTotalWithFees(0);
    }
  }, [formData.amount, fees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

      if ((type === "withdrawal" || type === "send") && totalWithFees > currentBalance) {
        throw new Error("Insufficient balance");
      }

      // Deduct balance (even in pending state)
      if (type === "withdrawal" || type === "send") {
        await supabase.rpc("update_balance", { user_id: user.id, amount: -totalWithFees });
      }

      // Insert transaction
      await supabase.from("transactions").insert({
        user_id: user.id,
        type,
        amount,
        fee: calculatedFee,
        total_amount: totalWithFees,
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

          <div className="text-sm text-gray-600">
            Fee: <span className="font-bold">{calculatedFee.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Total with fees: <span className="font-bold">{totalWithFees.toFixed(2)}</span>
          </div>

          {type === "deposit" && (
            <>
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
