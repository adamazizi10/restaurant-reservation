import { getAuthenticatedUser } from "@/lib/auth/session";
import { AuthorizationError } from "@/lib/authorization/errors";
import {
  hasRestaurantPermission,
  isRestaurantRole,
  type RestaurantPermission,
  type RestaurantRole
} from "@/lib/authorization/permissions";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type RestaurantAccess = {
  userId: string;
  restaurantId: string;
  membershipId: string;
  role: RestaurantRole;
};

export type RestaurantAccessResult =
  | {
      status: "authorized";
      access: RestaurantAccess;
    }
  | {
      status: "unauthenticated" | "no_membership" | "invalid_membership";
    };

type MembershipRecord = {
  id: string;
  restaurant_id: string;
  role: unknown;
  user_id: string;
};

type RestaurantRecord = {
  id: string;
};

type CurrentRestaurantAccessOptions = {
  user?: User;
};

export async function getCurrentRestaurantAccess(
  options: CurrentRestaurantAccessOptions = {}
): Promise<RestaurantAccess | null> {
  const result = await resolveCurrentRestaurantAccess(options);

  return result.status === "authorized" ? result.access : null;
}

export async function resolveCurrentRestaurantAccess(
  options: CurrentRestaurantAccessOptions = {}
): Promise<RestaurantAccessResult> {
  const user = options.user ?? (await getAuthenticatedUser());

  if (!user) {
    return { status: "unauthenticated" };
  }

  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_memberships")
    .select("id, restaurant_id, role, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    console.error("Unable to resolve restaurant membership.", {
      code: membershipError.code,
      message: membershipError.message
    });
    return { status: "invalid_membership" };
  }

  if (!membership) {
    return { status: "no_membership" };
  }

  const access = await verifyRestaurantAccessMembership(user.id, membership, async (id) => {
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (restaurantError) {
      console.error("Unable to verify restaurant access.", {
        code: restaurantError.code,
        message: restaurantError.message
      });
      return null;
    }

    return restaurant;
  });

  if (!access) {
    return { status: "invalid_membership" };
  }

  return {
    access,
    status: "authorized"
  };
}

export async function requireRestaurantMembership(
  options: CurrentRestaurantAccessOptions = {}
): Promise<RestaurantAccess> {
  const result = await resolveCurrentRestaurantAccess(options);

  if (result.status === "authorized") {
    return result.access;
  }

  if (result.status === "unauthenticated") {
    throw new AuthorizationError("UNAUTHENTICATED", "Authentication required.");
  }

  if (result.status === "no_membership") {
    throw new AuthorizationError(
      "NO_RESTAURANT_MEMBERSHIP",
      "Restaurant membership required."
    );
  }

  if (result.status === "invalid_membership") {
    throw new AuthorizationError(
      "INVALID_RESTAURANT_MEMBERSHIP",
      "Restaurant access could not be verified."
    );
  }

  throw new AuthorizationError("INVALID_RESTAURANT_MEMBERSHIP");
}

export async function requireRestaurantPermission(
  permission: RestaurantPermission,
  options: CurrentRestaurantAccessOptions & { restaurantId?: string } = {}
) {
  const access = await requireRestaurantMembership(options);

  if (options.restaurantId && options.restaurantId !== access.restaurantId) {
    throw new AuthorizationError("FORBIDDEN");
  }

  if (!hasRestaurantPermission(access.role, permission)) {
    throw new AuthorizationError("FORBIDDEN");
  }

  return access;
}

export async function verifyRestaurantAccessMembership(
  userId: string,
  membership: MembershipRecord,
  findRestaurantById: (restaurantId: string) => Promise<RestaurantRecord | null>
): Promise<RestaurantAccess | null> {
  if (membership.user_id !== userId || !isRestaurantRole(membership.role)) {
    return null;
  }

  const restaurant = await findRestaurantById(membership.restaurant_id);

  if (!restaurant || restaurant.id !== membership.restaurant_id) {
    return null;
  }

  return {
    userId,
    restaurantId: membership.restaurant_id,
    membershipId: membership.id,
    role: membership.role
  };
}
