import { describe, expect, test } from "vitest";
import {
  hasRestaurantPermission,
  isRestaurantPermission,
  isRestaurantRole
} from "@/lib/authorization/permissions";

describe("restaurant authorization permissions", () => {
  test("Owner has owner-only, management, and operational permissions", () => {
    expect(hasRestaurantPermission("owner", "restaurant.account.manage")).toBe(true);
    expect(hasRestaurantPermission("owner", "restaurant.settings.manage")).toBe(true);
    expect(hasRestaurantPermission("owner", "restaurant.reservations.manage")).toBe(true);
  });

  test("Admin has management and operational permissions without owner account control", () => {
    expect(hasRestaurantPermission("admin", "restaurant.settings.manage")).toBe(true);
    expect(hasRestaurantPermission("admin", "restaurant.tables.manage")).toBe(true);
    expect(hasRestaurantPermission("admin", "restaurant.reservations.manage")).toBe(true);
    expect(hasRestaurantPermission("admin", "restaurant.account.manage")).toBe(false);
    expect(hasRestaurantPermission("admin", "restaurant.billing.manage")).toBe(false);
  });

  test("Staff has operational permission without administrative permissions", () => {
    expect(hasRestaurantPermission("staff", "restaurant.reservations.manage")).toBe(true);
    expect(hasRestaurantPermission("staff", "restaurant.settings.manage")).toBe(false);
    expect(hasRestaurantPermission("staff", "restaurant.staff.manage")).toBe(false);
    expect(hasRestaurantPermission("staff", "restaurant.account.manage")).toBe(false);
  });

  test("unknown roles and permissions fail closed", () => {
    expect(isRestaurantRole("owner")).toBe(true);
    expect(isRestaurantRole("platform_admin")).toBe(false);
    expect(isRestaurantPermission("restaurant.settings.manage")).toBe(true);
    expect(isRestaurantPermission("restaurant.everything.manage")).toBe(false);
    expect(hasRestaurantPermission("owner", "restaurant.everything.manage")).toBe(false);
    expect(hasRestaurantPermission("manager", "restaurant.reservations.manage")).toBe(false);
    expect(hasRestaurantPermission(null, "restaurant.reservations.manage")).toBe(false);
  });
});
