import { expect, test } from "@playwright/test";

test("home page links to authentication routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Simple reservation software"
  );
  await expect(page.getByRole("link", { name: "Log in" })).toHaveAttribute(
    "href",
    "/login"
  );
  await expect(
    page.getByRole("link", { name: "Create account" })
  ).toHaveAttribute("href", "/signup");
});

test("login page renders accessible email and password controls", async ({
  page
}) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Password")).toHaveAttribute("type", "password");
  await expect(
    page.getByRole("link", { name: "Forgot password?" })
  ).toHaveAttribute("href", "/forgot-password");
});

const liveSupabaseTest = process.env.RUN_LIVE_SUPABASE_E2E ? test : test.skip;

liveSupabaseTest("login shows a clean error for invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page
    .getByLabel("Email")
    .fill(`missing-user-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("not-the-right-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
});

test("signup page validates mismatched passwords", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password-one");
  await page.getByLabel("Confirm password").fill("password-two");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Passwords do not match.")).toBeVisible();
});

test("forgot password page renders reset request form", async ({ page }) => {
  await page.goto("/forgot-password");

  await expect(
    page.getByRole("heading", { name: "Reset your password" })
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveAttribute("type", "email");
  await expect(
    page.getByRole("button", { name: "Send reset instructions" })
  ).toBeVisible();
});

test("forgot password form validates malformed email", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Send reset instructions" }).click();

  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
});

liveSupabaseTest("forgot password submission returns the privacy-preserving confirmation", async ({
  page
}) => {
  await page.goto("/forgot-password");
  await page
    .getByLabel("Email")
    .fill(`missing-user-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Send reset instructions" }).click();

  await expect(
    page.getByText(
      "If an account exists for that email, we have sent password reset instructions."
    )
  ).toBeVisible();
});

test("invalid auth callback redirects to login with a clean error", async ({
  page
}) => {
  await page.goto("/auth/callback");

  await expect(page).toHaveURL(/\/login\?auth_error=/);
  await expect(
    page.getByText("The authentication link is missing required information.")
  ).toBeVisible();
});

test("reset password page handles missing recovery session", async ({ page }) => {
  await page.goto("/reset-password");

  await expect(
    page.getByText("Your password reset session is missing or expired.")
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request another reset email" })
  ).toHaveAttribute("href", "/forgot-password");
});

test("unauthenticated app route redirects to login", async ({ page }) => {
  await page.goto("/app");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("unauthenticated restaurant creation route redirects to login", async ({
  page
}) => {
  await page.goto("/app/create-restaurant");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
