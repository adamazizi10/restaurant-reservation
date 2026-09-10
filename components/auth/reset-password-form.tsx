"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/auth/actions";
import {
  initialAuthActionState,
  type AuthActionState
} from "@/lib/auth/state";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";

type ResetPasswordFormProps = {
  canReset: boolean;
  initialMessage?: string;
};

export function ResetPasswordForm({
  canReset,
  initialMessage
}: ResetPasswordFormProps) {
  const initialState: AuthActionState = initialMessage
    ? {
        status: canReset ? "idle" : "error",
        message: initialMessage
      }
    : initialAuthActionState;
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  if (!canReset) {
    return (
      <div className="auth-form">
        <FormMessage
          state={state}
          fallbackMessage="Request a new password reset link."
        />
        <Link className="auth-button auth-link-button" href="/forgot-password">
          Request another reset email
        </Link>
        <Link className="auth-secondary-link" href="/login">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" action={formAction} noValidate>
      <FormMessage state={state} />
      <div className="field-group">
        <label htmlFor="password">New password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
          required
        />
        {state.fieldErrors?.password ? (
          <p className="field-error" id="password-error">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>
      <div className="field-group">
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "confirm-password-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          required
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="field-error" id="confirm-password-error">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>
      <AuthSubmitButton pendingLabel="Updating...">
        Update password
      </AuthSubmitButton>
      <Link className="auth-secondary-link" href="/login">
        Back to login
      </Link>
    </form>
  );
}
