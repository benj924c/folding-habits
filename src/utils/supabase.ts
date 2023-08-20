import { $ } from "@builder.io/qwik";
import type { RequestEventLoader } from "@builder.io/qwik-city";
import {
  createServerClient,
  createBrowserClient,
} from "supabase-auth-helpers-qwik";
const SUPABASE_URL = "https://ktpddsxnbiirvlhvpwfu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cGRkc3huYmlpcnZsaHZwd2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0OTMwOTAsImV4cCI6MjAwNDA2OTA5MH0.E_mj-5GqtUoyX1rYtTMCV1ONU_ZcCy_uCrv-7N49Ypk";

export const supabaseBrowserClient = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

export const supabaseServerClient = $(async (requestEv: RequestEventLoader) =>
  createServerClient(
    requestEv.env.get("SUPABASE_URL")!,
    requestEv.env.get("SUPABASE_ANON_KEY")!,
    requestEv,
  ),
);
