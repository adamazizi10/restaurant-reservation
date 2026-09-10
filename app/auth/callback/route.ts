import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { appendMessage, getSafeRedirectPath } from "@/lib/auth/redirects";
import { toAuthErrorMessage } from "@/lib/auth/errors";
import {
  passwordRecoveryCookie,
  passwordRecoveryMaxAgeSeconds
} from "@/lib/auth/recovery";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email"
]);

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function successfulRedirect(request: NextRequest, path: string) {
  const response = redirectTo(request, path);

  if (path === "/reset-password") {
    response.cookies.set(passwordRecoveryCookie, "1", {
      httpOnly: true,
      maxAge: passwordRecoveryMaxAgeSeconds,
      path: "/",
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:"
    });
  }

  return response;
}

function getCallbackFailurePath(nextPath: string, message: string) {
  if (nextPath === "/reset-password") {
    return appendMessage("/reset-password", "auth_error", message);
  }

  return appendMessage("/login", "auth_error", message);
}

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const nextPath = getSafeRedirectPath(
    requestUrl.searchParams.get("next"),
    "/app"
  );
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");

  if (providerError) {
    return redirectTo(
      request,
      getCallbackFailurePath(
        nextPath,
        "The authentication link is invalid or expired."
      )
    );
  }

  if (!getSupabasePublicEnv()) {
    return redirectTo(
      request,
      getCallbackFailurePath(nextPath, "Supabase is not configured yet.")
    );
  }

  const supabase = await createClient();
  const code = requestUrl.searchParams.get("code");
  const flowId = requestUrl.searchParams.get("sb_flow_id");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined
    );

    if (error) {
      return redirectTo(
        request,
        getCallbackFailurePath(nextPath, toAuthErrorMessage(error))
      );
    }

    return successfulRedirect(request, nextPath);
  }

  if (tokenHash && type && emailOtpTypes.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType
    });

    if (error) {
      return redirectTo(
        request,
        getCallbackFailurePath(nextPath, toAuthErrorMessage(error))
      );
    }

    return successfulRedirect(request, nextPath);
  }

  return redirectTo(
    request,
    getCallbackFailurePath(
      nextPath,
      "The authentication link is missing required information."
    )
  );
}
