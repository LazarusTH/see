import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, idCard: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError || !authData.user) {
        throw authError || new Error("Failed to create user");
      }

      // Step 2: Handle ID card upload if provided
      let idCardUrl = null;
      if (formData.idCard) {
        const fileExt = formData.idCard.name.split(".").pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("id-cards")
          .upload(fileName, formData.idCard);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("id-cards")
          .getPublicUrl(fileName);
        idCardUrl = publicUrlData.publicUrl;
      }

      // Step 3: Create user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
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

      // Step 4: Create user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([
          {
            user_id: authData.user.id,
            role: formData.role,
          },
        ]);

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
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
              className="w-full border rounded-md p-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, placeOfBirth: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="residence">Residence</Label>
              <Input
                id="residence"
                value={formData.residence}
                onChange={(e) =>
                  setFormData({ ...formData, residence: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
              />
            </div>
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
