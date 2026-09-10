export const DEFAULT_TRIAL_DURATION_DAYS = 14;
const maxTrialDurationDays = 365;

export function parseTrialDurationDays(value: string | null | undefined) {
  if (value == null || value.trim() === "") {
    return DEFAULT_TRIAL_DURATION_DAYS;
  }

  if (!/^\d+$/.test(value.trim())) {
    throw new Error("TRIAL_DURATION_DAYS must be a positive integer.");
  }

  const trialDurationDays = Number(value);

  if (
    !Number.isSafeInteger(trialDurationDays) ||
    trialDurationDays < 1 ||
    trialDurationDays > maxTrialDurationDays
  ) {
    throw new Error("TRIAL_DURATION_DAYS must be between 1 and 365.");
  }

  return trialDurationDays;
}

export function getTrialDurationDays() {
  return parseTrialDurationDays(process.env.TRIAL_DURATION_DAYS);
}
