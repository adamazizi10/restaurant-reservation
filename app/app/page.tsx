import { logoutAction } from "@/lib/auth/actions";
import { requireVerifiedAuth } from "@/lib/auth/session";

export default async function AppPage() {
  const claims = await requireVerifiedAuth();

  return (
    <main className="signed-in-page">
      <section className="signed-in-panel" aria-labelledby="signed-in-title">
        <p className="eyebrow">Signed in</p>
        <h1 id="signed-in-title">You are signed in.</h1>
        <p>
          Restaurant setup will be added in the next step. This page only exists
          to verify authentication and session behavior.
        </p>
        {claims.email ? <p className="signed-in-email">{claims.email}</p> : null}
        <form action={logoutAction}>
          <button className="auth-button auth-button-inline" type="submit">
            Log out
          </button>
        </form>
      </section>
    </main>
  );
}
