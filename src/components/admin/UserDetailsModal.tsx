import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "react-query";

const UserDetailsModal = ({ user, onClose }) => {
  const [idCardUrl, setIdCardUrl] = useState(null);

  useEffect(() => {
    if (user?.id_card_url) {
      const { publicUrl } = supabase.storage.from("id-cards").getPublicUrl(user.id_card_url);
      setIdCardUrl(publicUrl || null);
    }
  }, [user?.id_card_url]);

  const fetchUserData = async (table) => {
    if (!user?.id) return [];
    const { data, error } = await supabase.from(table).select("*").eq("user_id", user.id);
    if (error) throw error;
    return data;
  };

  const { data: userLimits } = useQuery(["userLimits", user?.id], () => fetchUserData("user_limits"), {
    enabled: !!user?.id,
  });

  const { data: userFees } = useQuery(["userFees", user?.id], () => fetchUserData("fees"), {
    enabled: !!user?.id,
  });

  const { data: userBanks } = useQuery(["userBanks", user?.id], async () => {
    if (!user?.id) return [];
    const { data, error } = await supabase
      .from("user_banks")
      .select("*, banks ( name )")
      .eq("user_id", user.id);
    if (error) throw error;
    return data;
  }, {
    enabled: !!user?.id,
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
                {[
                  { label: "First Name", value: user?.first_name },
                  { label: "Last Name", value: user?.last_name },
                  { label: "Username", value: user?.username },
                  { label: "Email", value: user?.email },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
                    <p className="mt-1">{value || "N/A"}</p>
                  </div>
                ))}
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
