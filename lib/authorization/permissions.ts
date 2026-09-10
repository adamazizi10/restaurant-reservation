import type { Database } from "@/types/database";

export type RestaurantRole = Database["public"]["Enums"]["restaurant_role"];

export const RESTAURANT_ROLES = ["owner", "admin", "staff"] as const satisfies readonly RestaurantRole[];

export type RestaurantPermission =
  | "restaurant.account.manage"
  | "restaurant.billing.manage"
  | "restaurant.settings.manage"
  | "restaurant.tables.manage"
  | "restaurant.reservations.manage"
  | "restaurant.staff.manage";

export const RESTAURANT_PERMISSIONS = [
  "restaurant.account.manage",
  "restaurant.billing.manage",
  "restaurant.settings.manage",
  "restaurant.tables.manage",
  "restaurant.reservations.manage",
  "restaurant.staff.manage"
] as const satisfies readonly RestaurantPermission[];

const RESTAURANT_PERMISSION_SET = new Set<string>(RESTAURANT_PERMISSIONS);

const RESTAURANT_ROLE_SET = new Set<string>(RESTAURANT_ROLES);

const RESTAURANT_ROLE_PERMISSIONS = {
  owner: [
    "restaurant.account.manage",
    "restaurant.billing.manage",
    "restaurant.settings.manage",
    "restaurant.tables.manage",
    "restaurant.reservations.manage",
    "restaurant.staff.manage"
  ],
  admin: [
    "restaurant.settings.manage",
    "restaurant.tables.manage",
    "restaurant.reservations.manage",
    "restaurant.staff.manage"
  ],
  staff: ["restaurant.reservations.manage"]
} as const satisfies Record<RestaurantRole, readonly RestaurantPermission[]>;

export function isRestaurantRole(role: unknown): role is RestaurantRole {
  return typeof role === "string" && RESTAURANT_ROLE_SET.has(role);
}

export function isRestaurantPermission(
  permission: unknown
): permission is RestaurantPermission {
  return (
    typeof permission === "string" && RESTAURANT_PERMISSION_SET.has(permission)
  );
}

export function hasRestaurantPermission(
  role: unknown,
  permission: unknown
) {
  if (!isRestaurantRole(role) || !isRestaurantPermission(permission)) {
    return false;
  }

  const permissions: readonly RestaurantPermission[] =
    RESTAURANT_ROLE_PERMISSIONS[role];

  return permissions.includes(permission);
}
