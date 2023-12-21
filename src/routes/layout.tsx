import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { supabaseServerClient } from "~/utils/supabase"

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  })
}

export const useUserDetails = routeLoader$(async (requestEv) => {
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data } = await supabaseClient.auth.getUser()
  const { data: sessionData } = await supabaseClient.auth.getSession()
  return {
    isLoggedIn: data.user != null,
    user: data,
    session: sessionData.session,
  }
})

export default component$(() => {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="grid my-16 min-h-[60vh] self-center max-w-6xl prose">
        <Slot />
      </main>
      <Footer />
    </div>
  )
})
