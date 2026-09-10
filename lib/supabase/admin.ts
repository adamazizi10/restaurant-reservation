import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  requireSupabasePublicEnv,
  requireSupabaseServiceRoleKey
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const env = requireSupabasePublicEnv();
  const serviceRoleKey = requireSupabaseServiceRoleKey();

  return createSupabaseClient<Database>(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
