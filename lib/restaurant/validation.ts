export type RestaurantFormInput = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  website: string;
};

export type NormalizedRestaurantInput = RestaurantFormInput & {
  addressLine2: string;
  website: string;
};

export type RestaurantFieldErrors = Partial<
  Record<keyof RestaurantFormInput, string>
>;

const websitePattern = /^https?:\/\/[^\s.]+\.[^\s]+$/i;

export function readRestaurantFormInput(formData: FormData): RestaurantFormInput {
  return {
    name: readText(formData.get("name")),
    phone: readText(formData.get("phone")),
    addressLine1: readText(formData.get("addressLine1")),
    addressLine2: readText(formData.get("addressLine2")),
    city: readText(formData.get("city")),
    region: readText(formData.get("region")),
    postalCode: readText(formData.get("postalCode")),
    country: readText(formData.get("country")),
    website: readText(formData.get("website"))
  };
}

export function normalizeRestaurantInput(
  input: RestaurantFormInput
): NormalizedRestaurantInput {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2.trim(),
    city: input.city.trim(),
    region: input.region.trim(),
    postalCode: input.postalCode.trim(),
    country: input.country.trim(),
    website: normalizeWebsite(input.website)
  };
}

export function validateRestaurantInput(input: RestaurantFormInput) {
  const normalized = normalizeRestaurantInput(input);
  const fieldErrors: RestaurantFieldErrors = {};

  validateRequiredText(fieldErrors, "name", normalized.name, "Restaurant name", 160);
  validateRequiredText(fieldErrors, "phone", normalized.phone, "Business phone", 40);

  if (normalized.phone && normalized.phone.replace(/\D/g, "").length < 7) {
    fieldErrors.phone = "Enter a valid business phone.";
  }

  validateRequiredText(
    fieldErrors,
    "addressLine1",
    normalized.addressLine1,
    "Address line 1",
    180
  );
  validateOptionalText(
    fieldErrors,
    "addressLine2",
    normalized.addressLine2,
    "Address line 2",
    180
  );
  validateRequiredText(fieldErrors, "city", normalized.city, "City", 100);
  validateRequiredText(fieldErrors, "region", normalized.region, "Province/state/region", 100);
  validateRequiredText(fieldErrors, "postalCode", normalized.postalCode, "Postal/ZIP", 40);
  validateRequiredText(fieldErrors, "country", normalized.country, "Country", 100);

  if (normalized.website && !websitePattern.test(normalized.website)) {
    fieldErrors.website = "Enter a valid website URL.";
  }

  return {
    normalized,
    fieldErrors
  };
}

export function hasRestaurantFieldErrors(fieldErrors: RestaurantFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

function readText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function normalizeWebsite(value: string) {
  const website = value.trim();

  if (!website) {
    return "";
  }

  if (/^https?:\/\//i.test(website)) {
    return website;
  }

  return `https://${website}`;
}

function validateRequiredText(
  fieldErrors: RestaurantFieldErrors,
  field: keyof RestaurantFormInput,
  value: string,
  label: string,
  maxLength: number
) {
  if (!value) {
    fieldErrors[field] = `${label} is required.`;
    return;
  }

  if (value.length > maxLength) {
    fieldErrors[field] = `${label} must be ${maxLength} characters or fewer.`;
  }
}

function validateOptionalText(
  fieldErrors: RestaurantFieldErrors,
  field: keyof RestaurantFormInput,
  value: string,
  label: string,
  maxLength: number
) {
  if (value.length > maxLength) {
    fieldErrors[field] = `${label} must be ${maxLength} characters or fewer.`;
  }
}
