import { Slot, component$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"
import type { IsupabaseImmersionData } from "."

import { useGetLanguages } from "./components/AddLanguageButton"

export { useRedirectIfNotLoggedIn } from "~/hooks/useRedirectIfNotLoggedIn"
export { useGetLanguages }
export { useAddLanguage } from "./components/AddLanguageButton"
export { useAddImmersion } from "./components/AddImmersion/components/AddImmersionButton/components/ImmersionForm"

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
  const languages = useGetLanguages()
  if (immersion.value.data == null) return null
  if (languages.value.data == null) return null
  return <Slot />
})
