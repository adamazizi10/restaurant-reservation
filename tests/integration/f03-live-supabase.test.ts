import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { describe, expect, test } from "vitest";
import {
  hasRestaurantPermission,
  type RestaurantRole
} from "@/lib/authorization/permissions";
import type { Database } from "@/types/database";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const runLiveSupabaseTest =
  process.env.RUN_LIVE_SUPABASE_E2E &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? test
    : test.skip;

describe("F03 live Supabase authorization smoke test", () => {
  runLiveSupabaseTest(
    "normal authenticated reads stay scoped to the user's restaurant membership",
    async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const testId = randomUUID();
      const password = `F03-live-${testId}-password`;
      const emailA = `f03-user-a-${testId}@example.com`;
      const emailB = `f03-user-b-${testId}@example.com`;
      const admin = createClient<Database>(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      const userIds: string[] = [];
      const restaurantIds: string[] = [];

      try {
        const userA = await createVerifiedUser(admin, emailA, password);
        const userB = await createVerifiedUser(admin, emailB, password);
        userIds.push(userA, userB);

        const restaurantA = await createRestaurant(admin, "A", testId);
        const restaurantB = await createRestaurant(admin, "B", testId);
        restaurantIds.push(restaurantA, restaurantB);

        await createMembership(admin, restaurantA, userA, "owner");
        await createMembership(admin, restaurantB, userB, "staff");

        const userAClient = createClient<Database>(url, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const signInResult = await userAClient.auth.signInWithPassword({
          email: emailA,
          password
        });
        expect(signInResult.error).toBeNull();

        const { data: ownMemberships, error: membershipsError } =
          await userAClient.from("restaurant_memberships").select("*");
        expect(membershipsError).toBeNull();
        expect(ownMemberships).toHaveLength(1);
        expect(ownMemberships?.[0]?.restaurant_id).toBe(restaurantA);
        expect(ownMemberships?.[0]?.role).toBe("owner");

        const { data: ownRestaurant, error: ownRestaurantError } =
          await userAClient
            .from("restaurants")
            .select("id")
            .eq("id", restaurantA)
            .maybeSingle();
        expect(ownRestaurantError).toBeNull();
        expect(ownRestaurant?.id).toBe(restaurantA);

        const { data: otherRestaurant, error: otherRestaurantError } =
          await userAClient
            .from("restaurants")
            .select("id")
            .eq("id", restaurantB)
            .maybeSingle();
        expect(otherRestaurantError).toBeNull();
        expect(otherRestaurant).toBeNull();

        const { data: otherMemberships, error: otherMembershipsError } =
          await userAClient
            .from("restaurant_memberships")
            .select("id")
            .eq("restaurant_id", restaurantB);
        expect(otherMembershipsError).toBeNull();
        expect(otherMemberships).toEqual([]);

        expect(hasRestaurantPermission("owner", "restaurant.account.manage")).toBe(true);
        expect(hasRestaurantPermission("admin", "restaurant.account.manage")).toBe(false);
        expect(hasRestaurantPermission("staff", "restaurant.settings.manage")).toBe(false);
      } finally {
        await Promise.all(
          restaurantIds.map((id) => admin.from("restaurants").delete().eq("id", id))
        );
        await Promise.all(userIds.map((id) => admin.auth.admin.deleteUser(id)));
      }
    },
    45_000
  );
});

async function createVerifiedUser(
  admin: SupabaseClient<Database>,
  email: string,
  password: string
) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  expect(error).toBeNull();
  expect(data.user?.id).toBeTruthy();

  return data.user!.id;
}

async function createRestaurant(
  admin: SupabaseClient<Database>,
  suffix: string,
  testId: string
) {
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const { data, error } = await admin
    .from("restaurants")
    .insert({
      address_line_1: `${suffix} Test Street`,
      city: "Test City",
      country: "Test Country",
      name: `F03 Smoke ${suffix} ${testId}`,
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

async function createMembership(
  admin: SupabaseClient<Database>,
  restaurantId: string,
  userId: string,
  role: RestaurantRole
) {
  const { error } = await admin.from("restaurant_memberships").insert({
    restaurant_id: restaurantId,
    role,
    user_id: userId
  });

  expect(error).toBeNull();
}
