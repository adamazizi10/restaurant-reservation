"use server";

import { redirect } from "next/navigation";
import {
  getAuthenticatedUser,
  isUserEmailVerified
} from "@/lib/auth/session";
import { getCurrentRestaurantAccount } from "@/lib/restaurant/queries";
import type { RestaurantActionState } from "@/lib/restaurant/state";
import {
  hasRestaurantFieldErrors,
  readRestaurantFormInput,
  validateRestaurantInput
} from "@/lib/restaurant/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { getTrialDurationDays } from "@/lib/trial/config";

type SupabaseMutationError = {
  code?: string;
  message?: string;
};

export async function createRestaurantAction(
  _previousState: RestaurantActionState,
  formData: FormData
): Promise<RestaurantActionState> {
  const input = readRestaurantFormInput(formData);
  const { normalized, fieldErrors } = validateRestaurantInput(input);

  if (hasRestaurantFieldErrors(fieldErrors)) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      values: input
    };
  }

  if (!getSupabasePublicEnv()) {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Set the public Supabase URL and anon key in .env.local.",
      values: input
    };
  }

  if (!getSupabaseServiceRoleKey()) {
    return {
      status: "error",
      message:
        "Restaurant creation is not configured yet. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
      values: input
    };
  }

  let trialDurationDays: number;

  try {
    trialDurationDays = getTrialDurationDays();
  } catch {
    return {
      status: "error",
      message:
        "Trial configuration is invalid. TRIAL_DURATION_DAYS must be a positive integer.",
      values: input
    };
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      status: "error",
      message: "Please log in before creating a restaurant account.",
      values: input
    };
  }

  if (!isUserEmailVerified(user)) {
    return {
      status: "error",
      message: "Please verify your email before creating a restaurant account.",
      values: input
    };
  }

  const existingAccount = await getCurrentRestaurantAccount();

  if (existingAccount) {
    redirect("/app");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .rpc("create_restaurant_account", {
      p_address_line_1: normalized.addressLine1,
      p_address_line_2: normalized.addressLine2 || null,
      p_city: normalized.city,
      p_country: normalized.country,
      p_name: normalized.name,
      p_phone: normalized.phone,
      p_postal_code: normalized.postalCode,
      p_region: normalized.region,
      p_trial_duration_days: trialDurationDays,
      p_user_id: user.id,
      p_website: normalized.website || null
    })
    .single();

  if (error) {
    if (isDuplicateRestaurantError(error)) {
      redirect("/app");
    }

    return {
      status: "error",
      message: toRestaurantCreateErrorMessage(error),
      values: input
    };
  }

  if (!data?.restaurant_id) {
    return {
      status: "error",
      message: "Restaurant account was not created. Please try again.",
      values: input
    };
  }

  redirect("/app?created=1");
}

function isDuplicateRestaurantError(error: SupabaseMutationError) {
  return (
    error.code === "23505" ||
    error.message?.toLowerCase().includes("already exists")
  );
}

function toRestaurantCreateErrorMessage(error: SupabaseMutationError) {
  const message = error.message?.toLowerCase() ?? "";

  if (error.code === "28000" || message.includes("email verification")) {
    return "Please verify your email before creating a restaurant account.";
  }

  if (error.code === "23514" || message.includes("required")) {
    return "Please review the restaurant information and try again.";
  }

  if (error.code === "42883" || message.includes("function")) {
    return "Restaurant database setup is not complete. Apply the F02 migration first.";
  }

  return "Could not create the restaurant account. Please try again.";
}
