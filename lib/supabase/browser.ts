import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createClient() {
  const env = requireSupabasePublicEnv();

  return createBrowserClient<Database>(env.url, env.anonKey);
}
