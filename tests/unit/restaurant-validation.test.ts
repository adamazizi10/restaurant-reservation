import { describe, expect, test } from "vitest";
import {
  hasRestaurantFieldErrors,
  validateRestaurantInput,
  type RestaurantFormInput
} from "@/lib/restaurant/validation";

const validInput: RestaurantFormInput = {
  name: "  North Table  ",
  phone: "  416-555-0100  ",
  addressLine1: "  10 King St  ",
  addressLine2: "  Suite 2  ",
  city: "  Toronto  ",
  region: "  Ontario  ",
  postalCode: "  M5V 1A1  ",
  country: "  Canada  ",
  website: "  northtable.example  "
};

describe("restaurant validation", () => {
  test("normalizes valid input and prefixes website protocol", () => {
    const result = validateRestaurantInput(validInput);

    expect(hasRestaurantFieldErrors(result.fieldErrors)).toBe(false);
    expect(result.normalized).toMatchObject({
      name: "North Table",
      phone: "416-555-0100",
      addressLine1: "10 King St",
      addressLine2: "Suite 2",
      city: "Toronto",
      region: "Ontario",
      postalCode: "M5V 1A1",
      country: "Canada",
      website: "https://northtable.example"
    });
  });

  test("allows optional fields to be blank", () => {
    const result = validateRestaurantInput({
      ...validInput,
      addressLine2: " ",
      website: " "
    });

    expect(hasRestaurantFieldErrors(result.fieldErrors)).toBe(false);
    expect(result.normalized.addressLine2).toBe("");
    expect(result.normalized.website).toBe("");
  });

  test("requires minimum restaurant information", () => {
    const result = validateRestaurantInput({
      ...validInput,
      name: "",
      phone: "123",
      addressLine1: "",
      city: "",
      region: "",
      postalCode: "",
      country: ""
    });

    expect(result.fieldErrors).toMatchObject({
      name: "Restaurant name is required.",
      phone: "Enter a valid business phone.",
      addressLine1: "Address line 1 is required.",
      city: "City is required.",
      region: "Province/state/region is required.",
      postalCode: "Postal/ZIP is required.",
      country: "Country is required."
    });
  });

  test("rejects malformed websites", () => {
    const result = validateRestaurantInput({
      ...validInput,
      website: "https://not a url"
    });

    expect(result.fieldErrors.website).toBe("Enter a valid website URL.");
  });
});
