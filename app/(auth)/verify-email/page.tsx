import { AuthShell } from "@/components/auth/auth-shell";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

type VerifyEmailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readEmail(params: Record<string, string | string[] | undefined>) {
  const value = params.email;
  return Array.isArray(value) ? value[0] : value;
}

export default async function VerifyEmailPage({
  searchParams
}: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const email = readEmail(params) ?? "";

  return (
    <AuthShell
      title="Check your email"
      subtitle="Verify your email to continue."
    >
      {email ? (
        <p className="auth-note">
          We sent a verification link to <strong>{email}</strong>.
        </p>
      ) : (
        <p className="auth-note">
          Enter your email below to request another verification link.
        </p>
      )}
      <ResendVerificationForm email={email} />
    </AuthShell>
  );
}
