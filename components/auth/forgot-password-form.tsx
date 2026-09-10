"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/state";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
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
      <AuthSubmitButton pendingLabel="Sending...">
        Send reset instructions
      </AuthSubmitButton>
      <Link className="auth-secondary-link" href="/login">
        Back to login
      </Link>
    </form>
  );
}
