import { headers } from "next/headers";

export async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";

  return `${protocol}://${host}`;
}

export async function getAuthEmailRedirectOrigin() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const origin = await getRequestOrigin();
  const url = new URL(origin);

  if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
    return "http://localhost:3000";
  }

  return origin;
}
