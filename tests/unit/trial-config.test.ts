import { describe, expect, test } from "vitest";
import {
  DEFAULT_TRIAL_DURATION_DAYS,
  parseTrialDurationDays
} from "@/lib/trial/config";

describe("trial configuration", () => {
  test("uses the default duration when unset", () => {
    expect(parseTrialDurationDays(undefined)).toBe(DEFAULT_TRIAL_DURATION_DAYS);
    expect(parseTrialDurationDays("")).toBe(DEFAULT_TRIAL_DURATION_DAYS);
  });

  test("accepts configurable durations", () => {
    expect(parseTrialDurationDays("7")).toBe(7);
    expect(parseTrialDurationDays("30")).toBe(30);
  });

  test("rejects invalid durations", () => {
    expect(() => parseTrialDurationDays("0")).toThrow(
      "TRIAL_DURATION_DAYS must be between 1 and 365."
    );
    expect(() => parseTrialDurationDays("-1")).toThrow(
      "TRIAL_DURATION_DAYS must be a positive integer."
    );
    expect(() => parseTrialDurationDays("14.5")).toThrow(
      "TRIAL_DURATION_DAYS must be a positive integer."
    );
    expect(() => parseTrialDurationDays("366")).toThrow(
      "TRIAL_DURATION_DAYS must be between 1 and 365."
    );
  });
});
