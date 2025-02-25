import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const { data: userLimits } = useQuery({
    queryKey: ["userLimits", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_limits")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });

  const { data: userFees } = useQuery({
    queryKey: ["userFees", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fees")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });

const { publicURL, error } = supabase
  .storage
  .from('id_cards')
  .getPublicUrl(user.id_card_url);

if (error) {
  console.error("Error fetching image:", error.message);
}


  const { data: userBanks } = useQuery({
    queryKey: ["userBanks", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_banks")
        .select(`
          *,
          banks (
            name
          )
        `)
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">First Name</h4>
                  <p className="mt-1">{user.first_name || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Name</h4>
                  <p className="mt-1">{user.last_name || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
                  <p className="mt-1">{user.username || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="mt-1">{user.email || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                  <p className="mt-1">{user.date_of_birth || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Place of Birth</h4>
                  <p className="mt-1">{user.place_of_birth || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Residence</h4>
                  <p className="mt-1">{user.residence || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Nationality</h4>
                  <p className="mt-1">{user.nationality || "N/A"}</p>
                </div>
              </div>
            </Card>

           {/* ID Card (Direct Display) */}
{user.id_card_url && (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">ID Card</h3>
    <div className="flex justify-center">
     <img
  src={publicURL}
  alt="ID Card"
  className="max-w-full w-auto h-auto rounded-lg shadow-md"
  style={{ maxHeight: '500px' }}
/>

    </div>
  </Card>
)}


            {/* Transaction Limits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Limits</h3>
              <div className="space-y-4">
                {userLimits?.map((limit) => (
                  <div key={limit.id} className="border-b pb-4">
                    <h4 className="font-medium capitalize">{limit.transaction_type} Limits</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily</p>
                        <p className="font-medium">${limit.daily_limit || "No limit"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly</p>
                        <p className="font-medium">${limit.weekly_limit || "No limit"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="font-medium">${limit.monthly_limit || "No limit"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Transaction Fees */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Fees</h3>
              <div className="space-y-4">
                {userFees?.map((fee) => (
                  <div key={fee.id} className="border-b pb-4">
                    <h4 className="font-medium capitalize">{fee.transaction_type} Fees</h4>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Type: {fee.fee_type}</p>
                      <p className="font-medium">
                        {fee.fee_type === 'percentage' ? `${fee.fee_value}%` : `$${fee.fee_value}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Assigned Banks */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Assigned Banks</h3>
              <div className="space-y-4">
                {userBanks?.map((bank) => (
                  <div key={bank.id} className="border-b pb-4">
                    <h4 className="font-medium">{bank.banks.name}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">{bank.account_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Name</p>
                        <p className="font-medium">{bank.account_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Account Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="mt-1 capitalize">{user.status || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
                  <p className="mt-1">${user.balance?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                  <p className="mt-1">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
