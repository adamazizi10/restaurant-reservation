"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resendVerificationAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/state";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";

type ResendVerificationFormProps = {
  email?: string;
};

export function ResendVerificationForm({
  email = ""
}: ResendVerificationFormProps) {
  const [state, formAction] = useActionState(resendVerificationAction, {
    ...initialAuthActionState,
    email
  });

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
          defaultValue={state.email || email}
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
        Resend verification email
      </AuthSubmitButton>
      <Link className="auth-secondary-link" href="/login">
        Back to login
      </Link>
    </form>
  );
}
