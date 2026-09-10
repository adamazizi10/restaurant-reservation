import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = getSafeRedirectPath(readParam(params, "next"), "/app");
  await redirectAuthenticatedUser(nextPath);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your reservation workspace."
    >
      <LoginForm
        nextPath={nextPath}
        initialMessage={readParam(params, "auth_error")}
      />
    </AuthShell>
  );
}
