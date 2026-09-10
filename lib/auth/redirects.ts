const defaultRedirectPath = "/app";

export function getSafeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = defaultRedirectPath
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();

  if (
    !trimmedValue ||
    !trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("//") ||
    trimmedValue.includes("\\")
  ) {
    return fallback;
  }

  try {
    const url = new URL(trimmedValue, "https://restaurant-reservations.local");

    if (url.origin !== "https://restaurant-reservations.local") {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function appendMessage(path: string, key: string, message: string) {
  const url = new URL(path, "https://restaurant-reservations.local");
  url.searchParams.set(key, message);

  return `${url.pathname}${url.search}`;
}
