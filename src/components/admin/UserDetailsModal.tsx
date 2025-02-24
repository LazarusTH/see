import React from "react";
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
  if (!user) return null;

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

      // Open the ID card in a new tab
      window.open(publicUrlData.publicUrl, "_blank");
    } catch (error) {
      toast.error("Failed to view ID card");
    }
  };

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
                <p className="mt-1">{user.first_name || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Name</h4>
                <p className="mt-1">{user.last_name || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
              <p className="mt-1">{user.username || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                <p className="mt-1">{user.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Place of Birth</h4>
                <p className="mt-1">{user.place_of_birth || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Residence</h4>
              <p className="mt-1">{user.residence || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nationality</h4>
              <p className="mt-1">{user.nationality || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">ID Card</h4>
              {user.id_card_url ? (
                <Button
                  variant="outline"
                  onClick={handleViewIdCard}
                  className="mt-2 gap-2"
                >
                  <Eye className="w-4 h-4" /> View ID Card
                </Button>
              ) : (
                <p className="mt-1">Not provided</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="mt-1 capitalize">{user.status || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                <p className="mt-1">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
              <p className="mt-1">${user.balance?.toFixed(2) || "0.00"}</p>
            </div>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;