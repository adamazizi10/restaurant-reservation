import { describe, expect, test } from "vitest";
import {
  formatTrialEndDate,
  getTrialDaysRemaining,
  getTrialState,
  getTrialSummary
} from "@/lib/trial/status";

describe("trial status helpers", () => {
  const now = new Date("2026-09-10T12:00:00.000Z");

  test("marks trials active before the stored end timestamp", () => {
    expect(getTrialState("2026-09-11T12:00:00.000Z", now)).toBe("trialing");
  });

  test("marks trials expired at and after the stored end timestamp", () => {
    expect(getTrialState("2026-09-10T12:00:00.000Z", now)).toBe("expired");
    expect(getTrialState("2026-09-09T12:00:00.000Z", now)).toBe("expired");
  });

  test("rounds remaining days up while active and clamps expired trials to zero", () => {
    expect(getTrialDaysRemaining("2026-09-10T13:00:00.000Z", now)).toBe(1);
    expect(getTrialDaysRemaining("2026-09-12T12:00:00.000Z", now)).toBe(2);
    expect(getTrialDaysRemaining("2026-09-10T11:59:59.000Z", now)).toBe(0);
  });

  test("returns a useful summary", () => {
    expect(getTrialSummary("2026-09-12T12:00:00.000Z", now)).toMatchObject({
      state: "trialing",
      daysRemaining: 2
    });
  });

  test("formats the stored end timestamp", () => {
    expect(formatTrialEndDate("2026-09-12T12:00:00.000Z", "en-US")).toContain(
      "Sep"
    );
  });
});
