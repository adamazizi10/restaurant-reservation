"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
};

export function AuthSubmitButton({
  children,
  pendingLabel = "Working..."
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className="auth-button"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
