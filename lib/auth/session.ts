import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getVerifiedAuthClaims() {
  if (!getSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims;
}

export async function requireVerifiedAuth() {
  const claims = await getVerifiedAuthClaims();

  if (!claims) {
    redirect("/login");
  }

  return claims;
}

export async function redirectAuthenticatedUser(nextPath?: string | null) {
  const claims = await getVerifiedAuthClaims();

  if (claims) {
    redirect(getSafeRedirectPath(nextPath, "/app"));
  }
}
