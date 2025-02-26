import React, { useEffect, useState } from "react";
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
  const [idCardUrl, setIdCardUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (user.id_card_url) {
        const { data } = supabase.storage.from("id-cards").getPublicUrl(user.id_card_url);
        setIdCardUrl(data.publicUrl);
      }
    };
    fetchImageUrl();
  }, [user.id_card_url]);

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

  const { data: userBanks } = useQuery({
    queryKey: ["userBanks", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_banks")
        .select("*, banks ( name )")
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
              </div>
            </Card>
            {idCardUrl && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">ID Card</h3>
                <div className="flex justify-center">
                  <img
                    src={idCardUrl}
                    alt="ID Card"
                    className="max-w-full w-auto h-auto rounded-lg shadow-md"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
