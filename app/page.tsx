import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-panel" aria-labelledby="page-title">
        <p className="eyebrow">Restaurant Reservations</p>
        <h1 id="page-title">
          Simple reservation software for independent restaurants.
        </h1>
        <p>
          Manage access with email and password authentication. Restaurant setup
          comes next.
        </p>
        <div className="home-actions">
          <Link className="auth-button auth-link-button" href="/login">
            Log in
          </Link>
          <Link className="secondary-button" href="/signup">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
