import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { emailTemplates } from "@/lib/emailService";
import { sendEmail, sendEmailWithFallback } from "@/lib/emailService";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "send";
  amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
  receipt_url?: string;
  recipient_email?: string;
  full_name?: string;
  banks?: {
    name: string;
  };
}

interface TransactionManagementProps {
  type: "deposit" | "withdrawal" | "send";
}

const TransactionManagement = ({ type }: TransactionManagementProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions, refetch } = useQuery<Transaction[]>({
    queryKey: ["transactions", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, type, amount, status, created_at,
          profiles:user_id(first_name, last_name, email),
          banks(name),
          receipt_url,
          recipient_email,
          full_name
        `)
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }

      return data as Transaction[];
    },
  });

  const handleApprove = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status: "approved" })
        .eq("id", transaction.id);

      if (error) throw error;

      // Send approval notification
      await sendEmailWithFallback({
        to: transaction.profiles.email,
        ...(transaction.type === "deposit" 
          ? emailTemplates.depositConfirmation(
              `${transaction.profiles.first_name} ${transaction.profiles.last_name}`,
              transaction.amount
            )
          : emailTemplates.withdrawalApproved(
              `${transaction.profiles.first_name} ${transaction.profiles.last_name}`,
              transaction.amount,
              transaction.banks?.name
            )
        )
      });

      toast.success("Transaction approved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (transaction: Transaction) => {
    try {
      let refundAmount = transaction.amount;

      // Apply fee and refund balance for "withdrawal" and "send" transactions
      if (transaction.type === "withdrawal" || transaction.type === "send") {
        const fee = 0.02; // Example fee rate (2%), adjust as needed
        refundAmount = transaction.amount * (1 - fee);

        // Fetch the user's balance (assuming email is used to identify the user)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("balance")
          .eq("email", transaction.profiles.email) // Adjust if using other field for user identification
          .single();

        if (profileError) throw profileError;

        const newBalance = profileData.balance + refundAmount;

        // Update user's balance with the refunded amount
        const { error: balanceError } = await supabase
          .from("profiles")
          .update({ balance: newBalance })
          .eq("email", transaction.profiles.email); // Adjust if using other field for user identification

        if (balanceError) throw balanceError;
      }

      // Update the transaction status to "rejected"
      const { error } = await supabase
        .from("transactions")
        .update({ status: "rejected" })
        .eq("id", transaction.id);

      if (error) throw error;

      toast.success("Transaction rejected and balance refunded successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {type === "deposit" ? "Deposits" : type === "withdrawal" ? "Withdrawals" : "Sends"} Management
          </h2>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.profiles.first_name} {transaction.profiles.last_name}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {transaction.profiles.email}
                    </span>
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={transaction.status === "approved" 
                        ? "bg-green-100 text-green-800" 
                        : transaction.status === "rejected" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {transaction.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(transaction)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(transaction)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Type</h4>
                  <p className="mt-1 capitalize">{selectedTransaction?.type}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Amount</h4>
                  <p className="mt-1">${selectedTransaction?.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <p className="mt-1 capitalize">{selectedTransaction?.status}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                  <p className="mt-1">
                    {selectedTransaction?.created_at &&
                      new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">User</h4>
                <p className="mt-1">
                  {selectedTransaction?.profiles.first_name}{" "}
                  {selectedTransaction?.profiles.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTransaction?.profiles.email}
                </p>
              </div>

              {selectedTransaction?.type === "withdrawal" && selectedTransaction?.banks && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Bank</h4>
                  <p className="mt-1">{selectedTransaction.banks.name}</p>
                </div>
              )}

              {selectedTransaction?.type === "send" && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Recipient Email
                  </h4>
                  <p className="mt-1">{selectedTransaction.recipient_email}</p>
                </div>
              )}

              {selectedTransaction?.type === "deposit" && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Depositor Name
                  </h4>
                  <p className="mt-1">{selectedTransaction.full_name}</p>
                </div>
              )}

              {selectedTransaction?.receipt_url && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    Receipt
                  </h4>
                  <Card className="p-6">
                    <div className="w-full">
                      <img
                        src={supabase.storage
                          .from("deposit-reciepts")
                          .getPublicUrl(selectedTransaction.receipt_url).publicURL}
                        alt="Receipt"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManagement;
