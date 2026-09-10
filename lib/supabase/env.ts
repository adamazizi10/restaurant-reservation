type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

const missingSupabaseEnvMessage =
  "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.";
const missingSupabaseServiceRoleKeyMessage =
  "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY in .env.local for server-side restaurant creation.";

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    anonKey
  };
}

export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(missingSupabaseEnvMessage);
  }

  return env;
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function requireSupabaseServiceRoleKey() {
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!serviceRoleKey) {
    throw new Error(missingSupabaseServiceRoleKeyMessage);
  }

  return serviceRoleKey;
}
