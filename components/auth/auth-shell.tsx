import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link
          href="/"
          className="auth-wordmark"
          aria-label="Restaurant Reservations home"
        >
          <span className="auth-mark" aria-hidden="true">
            R
          </span>
          <span>Restaurant Reservations</span>
        </Link>
        <div className="auth-heading">
          <h1 id="auth-title">{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {children}
      </section>
    </main>
  );
}
