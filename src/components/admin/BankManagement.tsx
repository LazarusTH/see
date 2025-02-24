import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssignBankModal from "./AssignBankModal";
import UserBanksModal from "./UserBanksModal";

const BankManagement = () => {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isAssignBankOpen, setIsAssignBankOpen] = useState(false);
  const [isUserBanksOpen, setIsUserBanksOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [newBankName, setNewBankName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: banks, refetch } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      // Modified the inner join to fetch username along with first_name and last_name.
      const { data, error } = await supabase
        .from("banks")
        .select(`
          *,
          user_banks (
            id,
            user_id,
            profiles (
              username,
              first_name,
              last_name
            )
          )
        `)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("banks")
        .insert({ name: newBankName });

      if (error) throw error;

      toast.success("Bank added successfully");
      setNewBankName("");
      setIsAddBankOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBank = (bank: any) => {
    setSelectedBank(bank);
    setIsAssignBankOpen(true);
  };

  const handleViewUsers = (bank: any) => {
    setSelectedBank(bank);
    setIsUserBanksOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Bank Management</h2>
        <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
          <DialogTrigger asChild>
            <Button>Add New Bank</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bank</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBank} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bankName">Bank Name</label>
                <Input
                  id="bankName"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Bank"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Users Count</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banks?.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell>{bank.name}</TableCell>
                <TableCell>{bank.user_banks?.length || 0}</TableCell>
                <TableCell>
                  {new Date(bank.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageBank(bank)}
                    >
                      Assign to User
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedBank && (
        <>
          <AssignBankModal
            isOpen={isAssignBankOpen}
            onClose={() => setIsAssignBankOpen(false)}
            bankId={selectedBank.id}
            bankName={selectedBank.name}
            onAssigned={() => {
              refetch();
              setIsAssignBankOpen(false);
            }}
          />
          <UserBanksModal
            isOpen={isUserBanksOpen}
            onClose={() => setIsUserBanksOpen(false)}
            bankId={selectedBank.id}
            bankName={selectedBank.name}
          />
        </>
      )}
    </div>
  );
};

export default BankManagement;
