import { describe, expect, test } from "vitest";
import { verifyRestaurantAccessMembership } from "@/lib/authorization/restaurant-access";

describe("F03 restaurant access resolution", () => {
  test("membership resolves access for the authenticated user's restaurant", async () => {
    const access = await verifyRestaurantAccessMembership(
      "user-a",
      {
        id: "membership-a",
        restaurant_id: "restaurant-a",
        role: "admin",
        user_id: "user-a"
      },
      async (restaurantId) => ({ id: restaurantId })
    );

    expect(access).toEqual({
      membershipId: "membership-a",
      restaurantId: "restaurant-a",
      role: "admin",
      userId: "user-a"
    });
  });

  test("a membership for another user does not resolve", async () => {
    const access = await verifyRestaurantAccessMembership(
      "user-a",
      {
        id: "membership-b",
        restaurant_id: "restaurant-b",
        role: "owner",
        user_id: "user-b"
      },
      async (restaurantId) => ({ id: restaurantId })
    );

    expect(access).toBeNull();
  });

  test("invalid roles and broken restaurant references fail closed", async () => {
    await expect(
      verifyRestaurantAccessMembership(
        "user-a",
        {
          id: "membership-a",
          restaurant_id: "restaurant-a",
          role: "superuser",
          user_id: "user-a"
        },
        async (restaurantId) => ({ id: restaurantId })
      )
    ).resolves.toBeNull();

    await expect(
      verifyRestaurantAccessMembership(
        "user-a",
        {
          id: "membership-a",
          restaurant_id: "restaurant-a",
          role: "staff",
          user_id: "user-a"
        },
        async () => null
      )
    ).resolves.toBeNull();
  });

  test("restaurant identifiers from outside the membership cannot override access", async () => {
    const access = await verifyRestaurantAccessMembership(
      "user-a",
      {
        id: "membership-a",
        restaurant_id: "restaurant-a",
        role: "owner",
        user_id: "user-a"
      },
      async () => ({ id: "restaurant-b" })
    );

    expect(access).toBeNull();
  });
});
