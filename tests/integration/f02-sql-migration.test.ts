import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const migrationPath = fileURLToPath(
  new URL(
    "../../supabase/migrations/20260910120000_create_restaurant_accounts.sql",
    import.meta.url
  )
);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("F02 migration", () => {
  test("creates the required tenant and membership tables", () => {
    expect(migrationSql).toContain("create table if not exists public.restaurants");
    expect(migrationSql).toContain(
      "create table if not exists public.restaurant_memberships"
    );
    expect(migrationSql).toContain(
      "constraint restaurant_memberships_one_restaurant_per_user_key unique (user_id)"
    );
    expect(migrationSql).toContain(
      "constraint restaurant_memberships_restaurant_user_key unique (restaurant_id, user_id)"
    );
  });

  test("stores trial timestamps instead of a mutable trial status string", () => {
    expect(migrationSql).toContain("trial_started_at timestamptz not null");
    expect(migrationSql).toContain("trial_ends_at timestamptz not null");
    expect(migrationSql).toContain(
      "constraint restaurants_trial_ends_after_start check"
    );
  });

  test("enables RLS and member-only reads", () => {
    expect(migrationSql).toContain(
      "alter table public.restaurants enable row level security"
    );
    expect(migrationSql).toContain(
      "alter table public.restaurant_memberships enable row level security"
    );
    expect(migrationSql).toContain("memberships.user_id = auth.uid()");
    expect(migrationSql).toContain("using (user_id = auth.uid())");
  });

  test("restricts account creation RPC to the service role", () => {
    expect(migrationSql).toContain(
      "create or replace function public.create_restaurant_account"
    );
    expect(migrationSql).toContain("security definer");
    expect(migrationSql).toContain("set search_path = public, auth, extensions");
    expect(migrationSql).toContain("revoke all on function public.create_restaurant_account");
    expect(migrationSql).toContain("from public, anon, authenticated");
    expect(migrationSql).toContain("to service_role");
  });
});
