import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const UserBanksModal = ({
  isOpen,
  onClose,
  userId,
  userName,
}: UserBanksModalProps) => {
  const { data: userBanks, refetch } = useQuery({
    queryKey: ["userBanks", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_banks")
        .select(`
          *,
          banks (
            name
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const handleRemoveBank = async (bankId: string) => {
    try {
      const { error } = await supabase
        .from("user_banks")
        .delete()
        .eq("id", bankId);

      if (error) throw error;

      toast.success("Bank removed successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{userName}'s Banks</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userBanks?.map((userBank) => (
              <TableRow key={userBank.id}>
                <TableCell>{userBank.banks.name}</TableCell>
                <TableCell>{userBank.account_number}</TableCell>
                <TableCell>{userBank.account_name}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveBank(userBank.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default UserBanksModal;