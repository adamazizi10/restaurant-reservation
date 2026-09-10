"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/state";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";

export function SignupForm() {
  const [state, formAction] = useActionState(
    signupAction,
    initialAuthActionState
  );

  return (
    <form className="auth-form" action={formAction} noValidate>
      <FormMessage state={state} />
      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          required
        />
        {state.fieldErrors?.email ? (
          <p className="field-error" id="email-error">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className="field-group">
        <label htmlFor="password">Password</label>
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
        <label htmlFor="confirmPassword">Confirm password</label>
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
      <AuthSubmitButton pendingLabel="Creating account...">
        Create account
      </AuthSubmitButton>
      <p className="auth-switch">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
