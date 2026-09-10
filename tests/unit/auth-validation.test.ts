import { describe, expect, it } from "vitest";
import {
  normalizeEmail,
  validateEmail,
  validatePasswordConfirmation,
  validateSignupFields
} from "@/lib/auth/validation";

describe("auth validation", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("  USER@Example.COM ")).toBe("user@example.com");
  });

  it("rejects malformed email addresses", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
  });

  it("accepts simple valid email addresses", () => {
    expect(validateEmail("owner@example.com")).toBeNull();
  });

  it("requires matching password confirmation", () => {
    expect(validatePasswordConfirmation("secret", "different")).toBe(
      "Passwords do not match."
    );
  });

  it("returns field errors for invalid signup values", () => {
    expect(validateSignupFields("bad", "", "x")).toEqual({
      email: "Enter a valid email address.",
      password: "Password is required.",
      confirmPassword: "Passwords do not match."
    });
  });
});
