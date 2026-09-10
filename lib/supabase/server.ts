import { createServerClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();
  const env = requireSupabasePublicEnv();

  return createServerClient<Database>(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies. The Next.js proxy refreshes auth sessions.
          }
        }
      }
    }
  );
}
