import { $ } from "@builder.io/qwik"
import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city"
import { createServerClient } from "supabase-auth-helpers-qwik"

export const supabaseServerClient = $(
  async (requestEv: RequestEventAction | RequestEventLoader) =>
    createServerClient(
      requestEv.env.get("SUPABASE_URL")!,
      requestEv.env.get("SUPABASE_ANON_KEY")!,
      requestEv,
    ),
)
