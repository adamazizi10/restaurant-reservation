import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const liveSupabaseTest =
  process.env.RUN_LIVE_SUPABASE_E2E &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? test
    : test.skip;

liveSupabaseTest("authenticated verified user without membership reaches create restaurant", async ({
  page
}) => {
  const fixture = await createLiveFixture();

  try {
    await page.goto("/login");
    await page.getByLabel("Email").fill(fixture.email);
    await page.getByLabel("Password").fill(fixture.password);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/app\/create-restaurant$/);
    await expect(
      page.getByRole("heading", { name: "Create restaurant account" })
    ).toBeVisible();
  } finally {
    await fixture.cleanup();
  }
});

liveSupabaseTest("authenticated restaurant member reaches app with database role", async ({
  page
}) => {
  const fixture = await createLiveFixture({ role: "owner" });

  try {
    await page.goto("/login");
    await page.getByLabel("Email").fill(fixture.email);
    await page.getByLabel("Password").fill(fixture.password);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByRole("heading", { name: fixture.restaurantName })).toBeVisible();
    await expect(page.getByText("Owner")).toBeVisible();
  } finally {
    await fixture.cleanup();
  }
});

type LiveFixtureOptions = {
  role?: Database["public"]["Enums"]["restaurant_role"];
};

async function createLiveFixture(options: LiveFixtureOptions = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const testId = randomUUID();
  const email = `f03-e2e-${testId}@example.com`;
  const password = `F03-e2e-${testId}-password`;
  const restaurantName = `F03 E2E ${testId}`;
  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const restaurantIds: string[] = [];
  let userId: string | null = null;

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  expect(userError).toBeNull();
  expect(userData.user?.id).toBeTruthy();
  userId = userData.user!.id;

  if (options.role) {
    const restaurantId = await createRestaurant(admin, restaurantName);
    restaurantIds.push(restaurantId);

    const { error: membershipError } = await admin
      .from("restaurant_memberships")
      .insert({
        restaurant_id: restaurantId,
        role: options.role,
        user_id: userId
      });
    expect(membershipError).toBeNull();
  }

  return {
    cleanup: async () => {
      await Promise.all(
        restaurantIds.map((id) => admin.from("restaurants").delete().eq("id", id))
      );

      if (userId) {
        await admin.auth.admin.deleteUser(userId);
      }
    },
    email,
    password,
    restaurantName
  };
}

async function createRestaurant(
  admin: SupabaseClient<Database>,
  restaurantName: string
) {
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const { data, error } = await admin
    .from("restaurants")
    .insert({
      address_line_1: "1 E2E Street",
      city: "Test City",
      country: "Test Country",
      name: restaurantName,
      phone: "555-0100",
      postal_code: "T3S T00",
      region: "Test Region",
      trial_ends_at: trialEndsAt.toISOString(),
      trial_started_at: now.toISOString()
    })
    .select("id")
    .single();

  expect(error).toBeNull();
  expect(data?.id).toBeTruthy();

  return data!.id;
}
