import AuthCard from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthCard title="Create account" subtitle="Get started with AI Voice Receptionist.">
      <SignupForm />
    </AuthCard>
  );
}
