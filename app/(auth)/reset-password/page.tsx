import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { passwordRecoveryCookie } from "@/lib/auth/recovery";
import { getVerifiedAuthClaims } from "@/lib/auth/session";
import { cookies } from "next/headers";

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResetPasswordPage({
  searchParams
}: ResetPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const claims = await getVerifiedAuthClaims();
  const hasRecoverySession = cookieStore.has(passwordRecoveryCookie);
  const error = readParam(params, "auth_error");

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Use the password reset link from your email before updating your password."
    >
      <ResetPasswordForm
        canReset={Boolean(claims) && hasRecoverySession && !error}
        initialMessage={
          error ??
          (!claims || !hasRecoverySession
            ? "Your password reset session is missing or expired."
            : undefined)
        }
      />
    </AuthShell>
  );
}
