"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/auth/actions";
import {
  initialAuthActionState,
  type AuthActionState
} from "@/lib/auth/state";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";

type LoginFormProps = {
  nextPath?: string;
  initialMessage?: string;
};

export function LoginForm({ nextPath = "/app", initialMessage }: LoginFormProps) {
  const initialState: AuthActionState = initialMessage
    ? {
        status: "error",
        message: initialMessage
      }
    : initialAuthActionState;
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form className="auth-form" action={formAction} noValidate>
      <input type="hidden" name="next" value={nextPath} />
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
          autoComplete="current-password"
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
      <AuthSubmitButton pendingLabel="Logging in...">Log in</AuthSubmitButton>
      <Link className="auth-secondary-link" href="/forgot-password">
        Forgot password?
      </Link>
      <p className="auth-switch">
        Do not have an account? <Link href="/signup">Create account</Link>
      </p>
    </form>
  );
}
