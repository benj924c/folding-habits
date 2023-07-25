import { component$, Slot, useContext, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { setSupabaseCookie } from "~/utils/supabase";
import { userDetailsContext } from "~/root";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useIsLoggedIn = routeLoader$(async (requestEv) => {
  const { cookie } = requestEv
  const refreshToken = cookie.get('my-refresh-token')?.value ?? ""
  const accessToken = cookie.get('my-access-token')?.value ?? ""
  const supabaseClient = createServerClient(
    requestEv.env.get("SUPABASE_URL")!,
    requestEv.env.get("SUPABASE_ANON_KEY")!,
    requestEv
  )
  const { data } = await supabaseClient.auth.getUser(accessToken)
  await supabaseClient.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  })
  const { data: sessionData } = await supabaseClient.auth.getSession()
  return { isLoggedIn: data.user != null, session: sessionData.session }
})

export default component$(() => {
  const isLoggedIn = useIsLoggedIn()
  const userDetails = useContext(userDetailsContext)

  useTask$(() => {
    userDetails.isLoggedIn = isLoggedIn.value.isLoggedIn
    userDetails.session = isLoggedIn.value.session
  })

  useVisibleTask$(() => setSupabaseCookie())

  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="grid max-w-7xl prose my-16 grow self-center p-4">
        <Slot />
      </main>
      <Footer />
    </div>
  )
});
