import { createClient } from "@/lib/supabase/server";
import { getCurrentRestaurantAccess } from "@/lib/authorization/restaurant-access";
import type { RestaurantRole } from "@/lib/authorization/permissions";
import type { Database } from "@/types/database";

export type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];
export type RestaurantMembershipRow =
  Database["public"]["Tables"]["restaurant_memberships"]["Row"];

export type RestaurantAccount = {
  membership: RestaurantMembershipRow & { role: RestaurantRole };
  restaurant: RestaurantRow;
};

export async function getCurrentRestaurantAccount(): Promise<RestaurantAccount | null> {
  const access = await getCurrentRestaurantAccess();

  if (!access) {
    return null;
  }

  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_memberships")
    .select("*")
    .eq("id", access.membershipId)
    .maybeSingle();

  if (membershipError) {
    console.error("Unable to load restaurant membership.", {
      code: membershipError.code,
      message: membershipError.message,
      details: membershipError.details,
      hint: membershipError.hint
    });
    throw new Error("Unable to load restaurant membership.");
  }

  if (!membership || membership.role !== access.role) {
    return null;
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", access.restaurantId)
    .maybeSingle();

  if (restaurantError) {
    console.error("Unable to load restaurant account.", {
      code: restaurantError.code,
      message: restaurantError.message,
      details: restaurantError.details,
      hint: restaurantError.hint
    });
    throw new Error("Unable to load restaurant account.");
  }

  if (!restaurant) {
    return null;
  }

  return {
    membership: {
      ...membership,
      role: access.role
    },
    restaurant
  };
}
