import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const SetFeesModal = ({ user, onClose, refetch }) => {
  const [fees, setFees] = useState({
    withdrawal: { fee_type: "percentage", fee_value: 0 },
    sending: { fee_type: "percentage", fee_value: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Upsert fees for withdrawal and sending
      const { error: withdrawalError } = await supabase
        .from("fees")
        .upsert(
          {
            user_id: user.id,
            transaction_type: "withdrawal",
            fee_type: fees.withdrawal.fee_type,
            fee_value: fees.withdrawal.fee_value,
          },
          { onConflict: ["user_id", "transaction_type"] }
        );

      const { error: sendingError } = await supabase
        .from("fees")
        .upsert(
          {
            user_id: user.id,
            transaction_type: "sending",
            fee_type: fees.sending.fee_type,
            fee_value: fees.sending.fee_value,
          },
          { onConflict: ["user_id", "transaction_type"] }
        );

      if (withdrawalError || sendingError) throw withdrawalError || sendingError;

      toast.success("Fees updated successfully");
      refetch();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Fees for {user.username}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Withdrawal Fees</h3>
            <div className="space-y-2">
              <label>Fee Type</label>
              <select
                value={fees.withdrawal.fee_type}
                onChange={(e) =>
                  setFees((prev) => ({
                    ...prev,
                    withdrawal: { ...prev.withdrawal, fee_type: e.target.value },
                  }))
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <label>Fee Value</label>
              <Input
                type="number"
                value={fees.withdrawal.fee_value}
                onChange={(e) =>
                  setFees((prev) => ({
                    ...prev,
                    withdrawal: { ...prev.withdrawal, fee_value: parseFloat(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold">Sending Fees</h3>
            <div className="space-y-2">
              <label>Fee Type</label>
              <select
                value={fees.sending.fee_type}
                onChange={(e) =>
                  setFees((prev) => ({
                    ...prev,
                    sending: { ...prev.sending, fee_type: e.target.value },
                  }))
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <label>Fee Value</label>
              <Input
                type="number"
                value={fees.sending.fee_value}
                onChange={(e) =>
                  setFees((prev) => ({
                    ...prev,
                    sending: { ...prev.sending, fee_value: parseFloat(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Fees"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetFeesModal;
