import { logoutAction } from "@/lib/auth/actions";
import { requireVerifiedEmailUser } from "@/lib/auth/session";
import { getCurrentRestaurantAccount } from "@/lib/restaurant/queries";
import { formatTrialEndDate, getTrialSummary } from "@/lib/trial/status";
import { redirect } from "next/navigation";

type AppPageProps = {
  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function AppPage(props: AppPageProps) {
  const user = await requireVerifiedEmailUser();
  const account = await getCurrentRestaurantAccount();
  const searchParams = await props.searchParams;

  if (!account) {
    redirect("/app/create-restaurant");
  }

  const trial = getTrialSummary(account.restaurant.trial_ends_at);
  const trialLabel =
    trial.state === "trialing" ? "Trial active" : "Trial expired";
  const daysRemainingLabel =
    trial.daysRemaining === 1
      ? "1 day remaining"
      : `${trial.daysRemaining} days remaining`;

  return (
    <main className="signed-in-page">
      <section className="signed-in-panel" aria-labelledby="signed-in-title">
        {searchParams.created === "1" ? (
          <p className="form-message form-message-success" role="status">
            Restaurant account created.
          </p>
        ) : null}
        <p className="eyebrow">Restaurant account</p>
        <h1 id="signed-in-title">{account.restaurant.name}</h1>
        <div className="trial-summary">
          <span
            className={`trial-badge trial-badge-${trial.state}`}
            aria-label={trialLabel}
          >
            {trialLabel}
          </span>
          <p>{daysRemainingLabel}</p>
          <p>Ends {formatTrialEndDate(trial.endsAt)}</p>
        </div>
        <dl className="restaurant-summary-list">
          <div>
            <dt>Role</dt>
            <dd>{toRestaurantRoleLabel(account.membership.role)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{account.restaurant.phone}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {account.restaurant.address_line_1}
              {account.restaurant.address_line_2
                ? `, ${account.restaurant.address_line_2}`
                : ""}
              , {account.restaurant.city}, {account.restaurant.region}{" "}
              {account.restaurant.postal_code}, {account.restaurant.country}
            </dd>
          </div>
        </dl>
        <form action={logoutAction}>
          <button className="auth-button auth-button-inline" type="submit">
            Log out
          </button>
        </form>
      </section>
    </main>
  );
}

function toRestaurantRoleLabel(role: string) {
  if (role === "owner") {
    return "Owner";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Staff";
}
