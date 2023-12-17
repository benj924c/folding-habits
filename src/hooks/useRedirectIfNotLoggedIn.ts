import { routeLoader$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"

// eslint-disable-next-line qwik/loader-location
export const useRedirectIfNotLoggedIn = routeLoader$(async (requestEv) => {
  const { redirect } = requestEv
  const supabaseClient = supabaseServerClient(requestEv)
  const { data } = await (await supabaseClient).auth.getUser()
  if (data.user == null) {
    throw redirect(308, "/login")
  }
})
