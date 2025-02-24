import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Plus, MoreVertical } from "lucide-react";
import AddUserModal from "@/components/admin/AddUserModal";
import ManageBalanceModal from "@/components/admin/ManageBalanceModal";
import SetLimitsModal from "@/components/admin/SetLimitsModal";
import SetFeesModal from "@/components/admin/SetFeesModal"; // New modal for setting fees
import UserDetailsModal from "@/components/admin/UserDetailsModal";

const UserManagement = () => {
  const [modalState, setModalState] = useState({
    addUser: false,
    manageBalance: false,
    setLimits: false,
    setFees: false, // New modal state for setting fees
    userDetails: false,
  });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*"); // Fetch all columns for user details
      if (error) throw error;
      return profiles;
    },
  });

  const filteredUsers = users.filter((user: any) =>
    `${user.first_name} ${user.last_name} ${user.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const openModal = (type: string, user: any = null) => {
    setSelectedUser(user);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: string) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "approved" })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User approved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "rejected" })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User rejected successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users: {error.message}</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Button onClick={() => openModal("addUser")}>
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Fees</TableHead> {/* New column for fees */}
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>${user.balance?.toFixed(2) || "0.00"}</TableCell>
                <TableCell>
                  {/* Display fees for withdrawal and sending */}
                  <div className="space-y-1">
                    <div>Withdrawal: {user.withdrawal_fee || "N/A"}</div>
                    <div>Sending: {user.sending_fee || "N/A"}</div>
                  </div>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(user.id)}>
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => openModal("manageBalance", user)}>
                        Manage Balance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal("setLimits", user)}>
                        Set Limit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal("setFees", user)}>
                        Set Fees
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal("userDetails", user)}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modalState.addUser && <AddUserModal onClose={() => closeModal("addUser")} refetch={refetch} />}
      {selectedUser && modalState.manageBalance && (
        <ManageBalanceModal userId={selectedUser.id} currentBalance={selectedUser.balance} onBalanceUpdated={refetch} />
      )}
      {selectedUser && modalState.setLimits && (
        <SetLimitsModal user={selectedUser} onClose={() => closeModal("setLimits")} refetch={refetch} />
      )}
      {selectedUser && modalState.setFees && (
        <SetFeesModal user={selectedUser} onClose={() => closeModal("setFees")} refetch={refetch} />
      )}
      {selectedUser && modalState.userDetails && (
        <UserDetailsModal user={selectedUser} onClose={() => closeModal("userDetails")} />
      )}
    </div>
  );
};

export default UserManagement;
