import { $ } from "@builder.io/qwik";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://ktpddsxnbiirvlhvpwfu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cGRkc3huYmlpcnZsaHZwd2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0OTMwOTAsImV4cCI6MjAwNDA2OTA5MH0.E_mj-5GqtUoyX1rYtTMCV1ONU_ZcCy_uCrv-7N49Ypk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const setSupabaseCookie = $(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      // delete cookies on sign out
      const expires = new Date(0).toUTCString();
      document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
      document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    }
  });
});
