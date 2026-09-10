import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="signed-in-page">
      <section className="signed-in-panel" aria-labelledby="forbidden-title">
        <p className="eyebrow">Access denied</p>
        <h1 id="forbidden-title">Access denied</h1>
        <p>You do not have permission to perform this action.</p>
        <Link className="secondary-button auth-button-inline" href="/app">
          Back to app
        </Link>
      </section>
    </main>
  );
}
