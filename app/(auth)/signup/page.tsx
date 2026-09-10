import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function SignupPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthShell
      title="Create account"
      subtitle="Start with email and password. Restaurant setup comes next."
    >
      <SignupForm />
    </AuthShell>
  );
}
