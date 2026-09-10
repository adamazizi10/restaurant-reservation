export type FieldErrors = Partial<{
  email: string;
  password: string;
  confirmPassword: string;
}>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: FormDataEntryValue | string | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function readPassword(value: FormDataEntryValue | string | null) {
  return typeof value === "string" ? value : "";
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required.";
  }

  if (!emailPattern.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validateRequiredPassword(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }

  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return "Confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}

export function validateSignupFields(
  email: string,
  password: string,
  confirmPassword: string
) {
  const fieldErrors: FieldErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validateRequiredPassword(password);
  const confirmPasswordError = validatePasswordConfirmation(
    password,
    confirmPassword
  );

  if (emailError) {
    fieldErrors.email = emailError;
  }

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (confirmPasswordError) {
    fieldErrors.confirmPassword = confirmPasswordError;
  }

  return fieldErrors;
}

export function hasFieldErrors(fieldErrors: FieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}
