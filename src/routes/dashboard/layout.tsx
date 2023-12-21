import { Slot, component$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"
import type { IsupabaseImmersionData } from "."

export const useGetImmersionSessions = routeLoader$(async (requestEv) => {
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data: userDetails } = await supabaseClient.auth.getUser()
  const { data, error } = await supabaseClient
    .from("immersion_sessions")
    .select("*")
    .eq("user_id", userDetails.user?.id)
  return { data, error } as IsupabaseImmersionData
})

export default component$(() => {
  const immersion = useGetImmersionSessions()
  if (immersion.value.data == null) return null
  return <Slot />
})
