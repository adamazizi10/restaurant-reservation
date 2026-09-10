export type AuthorizationErrorCode =
  | "UNAUTHENTICATED"
  | "NO_RESTAURANT_MEMBERSHIP"
  | "INVALID_RESTAURANT_MEMBERSHIP"
  | "FORBIDDEN";

export class AuthorizationError extends Error {
  constructor(
    public readonly code: AuthorizationErrorCode,
    message = "Access denied."
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}
