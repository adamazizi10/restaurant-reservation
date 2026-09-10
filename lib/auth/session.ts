import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
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

export async function getAuthenticatedUser() {
  if (!getSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export function isUserEmailVerified(user: User) {
  return Boolean(user.email_confirmed_at || user.confirmed_at);
}

export async function requireVerifiedEmailUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (!isUserEmailVerified(user)) {
    const email = user.email ? `?email=${encodeURIComponent(user.email)}` : "";

    redirect(`/verify-email${email}`);
  }

  return user;
}

export async function redirectAuthenticatedUser(nextPath?: string | null) {
  const claims = await getVerifiedAuthClaims();

  if (claims) {
    redirect(getSafeRedirectPath(nextPath, "/app"));
  }
}
