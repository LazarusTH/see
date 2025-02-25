import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [idCardUrl, setIdCardUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        // Fetch user profile from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            id, first_name, last_name, username, date_of_birth, place_of_birth,
            residence, nationality, id_card_url, status, role, balance, created_at,
            email
          `)
          .eq("id", user.id)
          .single();

        if (profileError) throw new Error(profileError.message);

        // Fetch user bank information
        const { data: userBankData, error: userBankError } = await supabase
          .from("user_banks")
          .select(`
            bank_id, assigned_at
          `)
          .eq("user_id", user.id)
          .single();

        if (userBankError) throw new Error(userBankError.message);

        // Fetch user limits information
        const { data: userLimitsData, error: userLimitsError } = await supabase
          .from("user_limits")
          .select(`
            daily_limit, weekly_limit, monthly_limit, transaction_type
          `)
          .eq("user_id", user.id)
          .single();

        if (userLimitsError) throw new Error(userLimitsError.message);

        // Fetch fees information
        const { data: feesData, error: feesError } = await supabase
          .from("fees")
          .select(`
            fee_value, fee_type, transaction_type
          `)
          .eq("user_id", user.id)
          .single();

        if (feesError) throw new Error(feesError.message);

        // Fetch transaction history
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select(`
            id, amount, fee, total_amount, transaction_details, type, status,
            receipt_url, recipient_email, recipient_username, account_name,
            account_number, full_name, account_holder_name, created_at
          `)
          .eq("user_id", user.id);

        if (transactionsError) throw new Error(transactionsError.message);

        // Fetch the bank details
        const { data: bankData, error: bankError } = await supabase
          .from("banks")
          .select(`
            name
          `)
          .eq("id", userBankData?.bank_id)
          .single();

        if (bankError) throw new Error(bankError.message);

        // Set state with all fetched data
        setUserDetails({
          profile: profileData,
          bank: bankData,
          userBank: userBankData,
          userLimits: userLimitsData,
          fees: feesData,
          transactions: transactionsData,
        });

        const handleViewIdCard = async () => {
    if (!user.id_card_url) {
      toast.error("No ID Card available");
      return;
    }

    try {
      // Get the public URL for the ID card
      const { data: publicUrlData } = supabase.storage
        .from("id-cards")
        .getPublicUrl(user.id_card_url);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Could not get ID card URL");
      }

      // Open the ID card image directly in the modal (not a new tab)
      const imgElement = document.getElementById("id-card-img") as HTMLImageElement;
      imgElement.src = publicUrlData.publicUrl;
    } catch (error) {
      toast.error("Failed to view ID card");
    }
  };

    fetchUserDetails();
  }, [user]);

  if (!userDetails) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">First Name</h4>
                <p className="mt-1">{userDetails.profile.first_name || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Name</h4>
                <p className="mt-1">{userDetails.profile.last_name || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
              <p className="mt-1">{userDetails.profile.username || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                <p className="mt-1">{userDetails.profile.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Place of Birth</h4>
                <p className="mt-1">{userDetails.profile.place_of_birth || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Residence</h4>
              <p className="mt-1">{userDetails.profile.residence || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nationality</h4>
              <p className="mt-1">{userDetails.profile.nationality || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">ID Card</h4>
              {idCardUrl ? (
                <img
                  src={idCardUrl}
                  alt="ID Card"
                  className="mt-2 w-full max-h-96 object-cover"
                />
              ) : (
                <p className="mt-1">Not provided</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="mt-1 capitalize">{userDetails.profile.status || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
              <p className="mt-1">${userDetails.profile.balance?.toFixed(2) || "0.00"}</p>
            </div>

            {/* Limits */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Limits</h4>
              <p className="mt-1">
                Daily: {userDetails.userLimits.daily_limit || "N/A"}<br />
                Weekly: {userDetails.userLimits.weekly_limit || "N/A"}<br />
                Monthly: {userDetails.userLimits.monthly_limit || "N/A"}
              </p>
            </div>

            {/* Fees */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Fees</h4>
              <p className="mt-1">
                Fee Value: {userDetails.fees.fee_value || "N/A"}<br />
                Fee Type: {userDetails.fees.fee_type || "N/A"}
              </p>
            </div>

            {/* Bank Information */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Assigned Bank</h4>
              <p className="mt-1">{userDetails.bank.name || "N/A"}</p>
            </div>

            {/* Transaction History */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Transactions</h4>
              {userDetails.transactions.length > 0 ? (
                <ul>
                  {userDetails.transactions.map((transaction: any) => (
                    <li key={transaction.id} className="mt-2">
                      <p><strong>Amount:</strong> ${transaction.amount}</p>
                      <p><strong>Status:</strong> {transaction.status}</p>
                      <p><strong>Transaction Type:</strong> {transaction.type}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No transactions available</p>
              )}
            </div>

          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
