import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SetLimitsModalProps {
  user: any;
  onClose: () => void;
  refetch: () => void;
}

const SetLimitsModal = ({ user, onClose, refetch }: SetLimitsModalProps) => {
  const [limits, setLimits] = useState({
    withdrawal: {
      daily_limit: "No Limit",
      weekly_limit: "No Limit",
      monthly_limit: "No Limit",
      limit_created_at: null, // Added limit_created_at
    },
    sending: {
      daily_limit: "No Limit",
      weekly_limit: "No Limit",
      monthly_limit: "No Limit",
      limit_created_at: null, // Added limit_created_at
    },
  });

  const [loading, setLoading] = useState(false);

  // Fetch current user limits when the modal is opened
  useEffect(() => {
    const fetchUserLimits = async () => {
      try {
        // Fetch limits for both withdrawal and sending
        const { data, error } = await supabase
          .from("user_limits")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        // Separate withdrawal and sending limits
        const withdrawalLimits = data?.find(
          (item) => item.transaction_type === "withdrawal"
        );
        const sendingLimits = data?.find(
          (item) => item.transaction_type === "sending"
        );

        setLimits({
          withdrawal: withdrawalLimits
            ? {
                daily_limit: withdrawalLimits.daily_limit?.toString() || "No Limit",
                weekly_limit: withdrawalLimits.weekly_limit?.toString() || "No Limit",
                monthly_limit: withdrawalLimits.monthly_limit?.toString() || "No Limit",
                limit_created_at: withdrawalLimits.limit_created_at || null, // Added limit_created_at
              }
            : { daily_limit: "No Limit", weekly_limit: "No Limit", monthly_limit: "No Limit", limit_created_at: null },

          sending: sendingLimits
            ? {
                daily_limit: sendingLimits.daily_limit?.toString() || "No Limit",
                weekly_limit: sendingLimits.weekly_limit?.toString() || "No Limit",
                monthly_limit: sendingLimits.monthly_limit?.toString() || "No Limit",
                limit_created_at: sendingLimits.limit_created_at || null, // Added limit_created_at
              }
            : { daily_limit: "No Limit", weekly_limit: "No Limit", monthly_limit: "No Limit", limit_created_at: null },
        });
      } catch (error: any) {
        console.error("Error fetching user limits:", error.message);
        toast.error("Failed to fetch user limits");
      }
    };

    fetchUserLimits();
  }, [user.id]);

  const handleSetLimits = async () => {
    setLoading(true);

    try {
      // Prepare the data for insertion or update
      const newLimits = [
        {
          user_id: user.id,
          transaction_type: "withdrawal",
          daily_limit: limits.withdrawal.daily_limit === "No Limit" ? null : parseFloat(limits.withdrawal.daily_limit),
          weekly_limit: limits.withdrawal.weekly_limit === "No Limit" ? null : parseFloat(limits.withdrawal.weekly_limit),
          monthly_limit: limits.withdrawal.monthly_limit === "No Limit" ? null : parseFloat(limits.withdrawal.monthly_limit),
          limit_created_at: new Date().toISOString(), // Set current timestamp for limit_created_at
        },
        {
          user_id: user.id,
          transaction_type: "sending",
          daily_limit: limits.sending.daily_limit === "No Limit" ? null : parseFloat(limits.sending.daily_limit),
          weekly_limit: limits.sending.weekly_limit === "No Limit" ? null : parseFloat(limits.sending.weekly_limit),
          monthly_limit: limits.sending.monthly_limit === "No Limit" ? null : parseFloat(limits.sending.monthly_limit),
          limit_created_at: new Date().toISOString(), // Set current timestamp for limit_created_at
        },
      ];

      // Upsert new limits
      const { error } = await supabase.from("user_limits").upsert(newLimits, {
        onConflict: ["user_id", "transaction_type"],
      });

      if (error) throw error;

      toast.success("Limits updated successfully");
      refetch();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent aria-describedby="set-limit-modal-description">
        <DialogHeader>
          <DialogTitle>Set Limits for {user.username}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Withdrawal Limits */}
          <div>
            <h3 className="font-bold">Withdrawal Limits</h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <label>Daily Limit</label>
                <Input
                  value={limits.withdrawal.daily_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      withdrawal: { ...prev.withdrawal, daily_limit: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Weekly Limit</label>
                <Input
                  value={limits.withdrawal.weekly_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      withdrawal: { ...prev.withdrawal, weekly_limit: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Monthly Limit</label>
                <Input
                  value={limits.withdrawal.monthly_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      withdrawal: { ...prev.withdrawal, monthly_limit: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Sending Limits */}
          <div>
            <h3 className="font-bold">Sending Limits</h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <label>Daily Limit</label>
                <Input
                  value={limits.sending.daily_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      sending: { ...prev.sending, daily_limit: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Weekly Limit</label>
                <Input
                  value={limits.sending.weekly_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      sending: { ...prev.sending, weekly_limit: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Monthly Limit</label>
                <Input
                  value={limits.sending.monthly_limit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      sending: { ...prev.sending, monthly_limit: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSetLimits} disabled={loading}>
              {loading ? "Setting..." : "Set Limits"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetLimitsModal;
