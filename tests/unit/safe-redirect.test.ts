import { describe, expect, it } from "vitest";
import { appendMessage, getSafeRedirectPath } from "@/lib/auth/redirects";

describe("safe auth redirects", () => {
  it("allows internal paths", () => {
    expect(getSafeRedirectPath("/app?message=hello")).toBe(
      "/app?message=hello"
    );
  });

  it("rejects absolute URLs", () => {
    expect(getSafeRedirectPath("https://example.com/app")).toBe("/app");
  });

  it("rejects protocol-relative URLs", () => {
    expect(getSafeRedirectPath("//example.com/app")).toBe("/app");
  });

  it("rejects backslash paths", () => {
    expect(getSafeRedirectPath("/\\example.com")).toBe("/app");
  });

  it("appends encoded auth messages", () => {
    expect(appendMessage("/login", "auth_error", "Invalid link")).toBe(
      "/login?auth_error=Invalid+link"
    );
  });
});
