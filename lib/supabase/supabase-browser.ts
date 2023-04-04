import { Database } from "@/types/supabase";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => createBrowserSupabaseClient<Database>();
