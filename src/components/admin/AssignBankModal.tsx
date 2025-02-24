import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";

interface AssignBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankId: string;
  bankName: string;
  onAssigned: () => void;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AssignBankModal = ({ isOpen, onClose, bankId, bankName, onAssigned }: AssignBankModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const { data: allUsers, error: usersError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email");

      if (usersError) throw usersError;

      const { data: assignedUsers, error: assignedError } = await supabase
        .from("user_banks")
        .select("user_id")
        .eq("bank_id", bankId);

      if (assignedError) throw assignedError;

      const assignedUserIds = new Set(assignedUsers.map((u) => u.user_id));
      setSelectedUsers(assignedUserIds);
      setUsers(allUsers);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = new Set(prev);
      if (newSelectedUsers.has(userId)) {
        newSelectedUsers.delete(userId);
      } else {
        newSelectedUsers.add(userId);
      }
      return newSelectedUsers;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: currentAssignments } = await supabase
        .from("user_banks")
        .select("user_id")
        .eq("bank_id", bankId);

      const currentUserIds = new Set(currentAssignments?.map((a) => a.user_id) || []);
      const selectedUserIds = Array.from(selectedUsers);
      const usersToAdd = selectedUserIds.filter((id) => !currentUserIds.has(id));
      const usersToRemove = Array.from(currentUserIds).filter((id) => !selectedUsers.has(id));

      if (usersToAdd.length > 0) {
        const { error: insertError } = await supabase.from("user_banks").insert(
          usersToAdd.map((userId) => ({ user_id: userId, bank_id: bankId }))
        );
        if (insertError) throw insertError;
      }

      if (usersToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from("user_banks")
          .delete()
          .eq("bank_id", bankId)
          .in("user_id", usersToRemove);
        if (deleteError) throw deleteError;
      }

      toast.success("Bank assignments updated successfully");
      onAssigned();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Users to {bankName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  checked={selectedUsers.has(user.id)}
                  onCheckedChange={() => handleUserToggle(user.id)}
                />
                <label className="flex-1 cursor-pointer">
                  {user.first_name} {user.last_name} ({user.email})
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBankModal;
