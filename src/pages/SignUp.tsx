import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sendEmail, emailTemplates } from '@/lib/emailService';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  residence: string;
  nationality: string;
  password: string;
  idCard: File | null;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    placeOfBirth: "",
    residence: "",
    nationality: "",
    password: "",
    idCard: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, idCard: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Sign up the user using Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError || !authData.user) {
        throw signUpError || new Error("Sign up failed");
      }

      // 2. Upload ID card if provided
      let idCardUrl = null;
      if (formData.idCard) {
        const fileExt = formData.idCard.name.split(".").pop();
        const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("id-cards")
          .upload(fileName, formData.idCard);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from("id-cards")
          .getPublicUrl(fileName);
        idCardUrl = publicUrlData.publicUrl;
      }

      // 3. Insert user profile into the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          date_of_birth: formData.dateOfBirth,
          place_of_birth: formData.placeOfBirth,
          residence: formData.residence,
          nationality: formData.nationality,
          id_card_url: idCardUrl,
          status: "pending", // Set status to "pending"
          balance: 0, // Default balance
          role: "user", // Default role
          email: formData.email, // Store email for reference
        });

      if (profileError) throw profileError;

      // 4. Insert user role into user_roles table
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "user", // Always set the default role to "user"
        });

      if (roleError) throw roleError;

      // Send welcome email
      await sendEmail({
        to: formData.email,
        ...emailTemplates.welcomeEmail(formData.firstName)
      });

      toast.success("Account created successfully! Please check your email to verify your account.");
      navigate("/signin");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residence">Residence</Label>
              <Input
                id="residence"
                value={formData.residence}
                onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idCard">ID Card Upload</Label>
              <Input
                id="idCard"
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                required
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload a clear image or PDF of your ID card
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-primary hover:underline mb-4 inline-block"
        >
          &larr; Back to Home
        </Link>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Step {step} of 3:{" "}
            {step === 1
              ? "Basic Information"
              : step === 2
              ? "Personal Details"
              : "Document Upload"}
          </p>
        </div>

        <Progress value={(step / 3) * 100} className="h-1" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(step - 1, 1))}
              disabled={step === 1 || isLoading}
            >
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {step === 3 ? "Sign Up" : "Next"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
