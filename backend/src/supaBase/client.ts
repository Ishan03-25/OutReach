import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_PROJECT_URL || !process.env.SUPABASE_PUBLISHER_KEY) {
  throw new Error("Missing environment variables");
}

export const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PUBLISHER_KEY);
