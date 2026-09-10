import type { AuthActionState } from "@/lib/auth/state";

type FormMessageProps = {
  state: AuthActionState;
  fallbackMessage?: string;
};

export function FormMessage({ state, fallbackMessage }: FormMessageProps) {
  const message = state.message || fallbackMessage;

  if (!message) {
    return null;
  }

  return (
    <p className={`form-message form-message-${state.status}`} role="status">
      {message}
    </p>
  );
}
