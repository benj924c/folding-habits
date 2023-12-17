import { routeLoader$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"

// eslint-disable-next-line qwik/loader-location
export const useRedirectIfLoggedIn = routeLoader$(async (requestEv) => {
  const { redirect } = requestEv
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data } = await supabaseClient.auth.getUser()
  if (data.user != null) {
    throw redirect(308, "/dashboard")
  }
})
