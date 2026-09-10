export type TrialState = "trialing" | "expired";

export type TrialSummary = {
  state: TrialState;
  daysRemaining: number;
  endsAt: Date;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function getTrialState(trialEndsAt: Date | string, now = new Date()): TrialState {
  const endsAt = toDate(trialEndsAt);

  return now.getTime() < endsAt.getTime() ? "trialing" : "expired";
}

export function getTrialDaysRemaining(
  trialEndsAt: Date | string,
  now = new Date()
) {
  const endsAt = toDate(trialEndsAt);
  const remainingMilliseconds = endsAt.getTime() - now.getTime();

  if (remainingMilliseconds <= 0) {
    return 0;
  }

  return Math.ceil(remainingMilliseconds / millisecondsPerDay);
}

export function getTrialSummary(
  trialEndsAt: Date | string,
  now = new Date()
): TrialSummary {
  const endsAt = toDate(trialEndsAt);

  return {
    state: getTrialState(endsAt, now),
    daysRemaining: getTrialDaysRemaining(endsAt, now),
    endsAt
  };
}

export function formatTrialEndDate(
  trialEndsAt: Date | string,
  locale = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(toDate(trialEndsAt));
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}
