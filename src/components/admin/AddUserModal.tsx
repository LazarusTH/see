import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface AddUserModalProps {
  onClose: () => void;
  refetch: () => void;
}

const AddUserModal = ({ onClose, refetch }: AddUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    dateOfBirth: "",
    placeOfBirth: "",
    residence: "",
    nationality: "",
    idCard: null as File | null,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, idCard: e.target.files[0] }));
    }
  };

  const handleAuthSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error || !data.user) throw new Error(error?.message || "Failed to create user");
    return data.user;
  };

  const handleFileUpload = async (userId: string) => {
    if (formData.idCard) {
      const fileExt = formData.idCard.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("id-cards")
        .upload(fileName, formData.idCard);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("id-cards")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await handleAuthSignUp();
      const idCardUrl = await handleFileUpload(user.id);

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            date_of_birth: formData.dateOfBirth || null,
            place_of_birth: formData.placeOfBirth || null,
            residence: formData.residence || null,
            nationality: formData.nationality || null,
            id_card_url: idCardUrl,
            status: "approved",
            balance: 0,
          },
        ]);
      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ user_id: user.id, role: formData.role }]);
      if (roleError) throw roleError;

      toast.success("User created successfully");
      refetch();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{`${field.charAt(0).toUpperCase() + field.slice(1)} Name`}</Label>
                <Input
                  id={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["dateOfBirth", "placeOfBirth", "residence", "nationality"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{`${field.charAt(0).toUpperCase() + field.slice(1)}`}</Label>
                <Input
                  id={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="idCard">Upload ID Card</Label>
            <Input
              id="idCard"
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload a clear image or PDF of the ID card
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
