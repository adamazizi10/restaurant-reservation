"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { appendMessage, getSafeRedirectPath } from "@/lib/auth/redirects";
import { toAuthErrorMessage } from "@/lib/auth/errors";
import { passwordRecoveryCookie } from "@/lib/auth/recovery";
import { getAuthEmailRedirectOrigin } from "@/lib/auth/url";
import type { AuthActionState } from "@/lib/auth/state";
import {
  hasFieldErrors,
  normalizeEmail,
  readPassword,
  validateEmail,
  validatePasswordConfirmation,
  validateRequiredPassword,
  validateSignupFields,
  type FieldErrors
} from "@/lib/auth/validation";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function missingConfigState(email?: string): AuthActionState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Set the public Supabase URL and anon key in .env.local.",
    email
  };
}

function getAuthRedirect(origin: string, nextPath: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  const confirmPassword = readPassword(formData.get("confirmPassword"));
  const fieldErrors = validateSignupFields(email, password, confirmPassword);

  if (hasFieldErrors(fieldErrors)) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      email
    };
  }

  if (!getSupabasePublicEnv()) {
    return missingConfigState(email);
  }

  const supabase = await createClient();
  const origin = await getAuthEmailRedirectOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirect(origin, "/app")
    }
  });

  if (error) {
    return {
      status: "error",
      message: toAuthErrorMessage(error),
      email
    };
  }

  if (data.session) {
    redirect("/app");
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  const nextPath = getSafeRedirectPath(formData.get("next"), "/app");
  const fieldErrors: FieldErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validateRequiredPassword(password);

  if (emailError) {
    fieldErrors.email = emailError;
  }

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (hasFieldErrors(fieldErrors)) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      email
    };
  }

  if (!getSupabasePublicEnv()) {
    return missingConfigState(email);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      status: "error",
      message: toAuthErrorMessage(error),
      email
    };
  }

  redirect(nextPath);
}

export async function resendVerificationAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get("email"));
  const emailError = validateEmail(email);

  if (emailError) {
    return {
      status: "error",
      message: emailError,
      fieldErrors: {
        email: emailError
      },
      email
    };
  }

  if (!getSupabasePublicEnv()) {
    return missingConfigState(email);
  }

  const supabase = await createClient();
  const origin = await getAuthEmailRedirectOrigin();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthRedirect(origin, "/app")
    }
  });

  if (error) {
    return {
      status: "error",
      message: toAuthErrorMessage(error),
      email
    };
  }

  return {
    status: "success",
    message: "Verification email sent. Please check your inbox.",
    email
  };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get("email"));
  const emailError = validateEmail(email);

  if (emailError) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        email: emailError
      },
      email
    };
  }

  if (!getSupabasePublicEnv()) {
    return missingConfigState(email);
  }

  const supabase = await createClient();
  const origin = await getAuthEmailRedirectOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirect(origin, "/reset-password")
  });

  if (error) {
    return {
      status: "error",
      message: toAuthErrorMessage(error),
      email
    };
  }

  return {
    status: "success",
    message:
      "If an account exists for that email, we have sent password reset instructions.",
    email
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = readPassword(formData.get("password"));
  const confirmPassword = readPassword(formData.get("confirmPassword"));
  const passwordError = validateRequiredPassword(password);
  const confirmPasswordError = validatePasswordConfirmation(
    password,
    confirmPassword
  );
  const fieldErrors: FieldErrors = {};

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (confirmPasswordError) {
    fieldErrors.confirmPassword = confirmPasswordError;
  }

  if (hasFieldErrors(fieldErrors)) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors
    };
  }

  if (!getSupabasePublicEnv()) {
    return missingConfigState();
  }

  const cookieStore = await cookies();

  if (!cookieStore.has(passwordRecoveryCookie)) {
    return {
      status: "error",
      message:
        "Your password reset session is missing or expired. Please request another reset email."
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    return {
      status: "error",
      message: toAuthErrorMessage(error)
    };
  }

  cookieStore.delete(passwordRecoveryCookie);
  redirect(appendMessage("/app", "message", "Password updated."));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(passwordRecoveryCookie);

  if (getSupabasePublicEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
