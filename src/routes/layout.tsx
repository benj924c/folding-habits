import { component$, Slot, useContext, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { setSupabaseCookie, supabase } from "~/utils/supabase";
import { userDetailsContext } from "~/root";

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

export const useIsLoggedIn = routeLoader$(async ({ cookie }) => {
  // const refreshToken = cookie.get('my-refresh-token')
  const accessToken = cookie.get('my-access-token')

  // if (refreshToken && accessToken) {
  //   await supabase.auth.setSession({
  //     refresh_token: refreshToken.value,
  //     access_token: accessToken.value,
  // })
  // }
  const { data } = await supabase.auth.getUser(accessToken?.value)
  return data.user != null
})

export default component$(() => {
  const isLoggedIn = useIsLoggedIn()
  const userDetails = useContext(userDetailsContext)

  useTask$(() => {
    userDetails.isLoggedIn = isLoggedIn.value
  })

  useVisibleTask$(async () => {
    const { data } = await supabase.auth.getSession()
    console.log(data)
    if (isLoggedIn.value && data.session?.user != null)
      userDetails.isLoggedIn = true
      userDetails.session = data.session
  })

  useVisibleTask$(() => setSupabaseCookie())

  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="grid max-w-7xl m-auto prose mt-4">
        <Slot />
      </main>
      <Footer />
    </div>
  )
});
