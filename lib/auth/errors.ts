type SupabaseAuthError = {
  code?: string;
  message?: string;
  status?: number;
};

const fallbackMessage = "Something went wrong. Please try again.";

export function toAuthErrorMessage(error: unknown) {
  const authError = error as SupabaseAuthError;
  const code = authError?.code?.toLowerCase();
  const message = authError?.message?.toLowerCase() ?? "";

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Please verify your email before logging in.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials")
  ) {
    return "Email or password is incorrect.";
  }

  if (message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email may already exist. Try logging in or resetting your password.";
  }

  if (message.includes("password")) {
    return (
      authError.message ??
      "The password was rejected by the configured password policy."
    );
  }

  if (message.includes("expired")) {
    return "This link has expired. Please request a new one.";
  }

  if (message.includes("invalid")) {
    return "This link is invalid. Please request a new one.";
  }

  return authError?.message || fallbackMessage;
}
