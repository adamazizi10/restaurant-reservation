import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "restaurant-reservation",
    environment: process.env.NODE_ENV ?? "unknown"
  });
}
