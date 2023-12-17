import { $, component$ } from "@builder.io/qwik"
import { Link, globalAction$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"
import { UserIcon } from "./components/UserIcon"
import { useUserDetails } from "~/routes/layout"

export const useLogout = globalAction$(async (_, requestEv) => {
  const { redirect } = requestEv
  await (await supabaseServerClient(requestEv)).auth.signOut()
  throw redirect(301, "/")
})

export const Header = component$(() => {
  const logout = useLogout()
  const userDetails = useUserDetails()

  const handleLogout = $(async () => {
    await logout.submit()
  })

  return (
    <div class="navbar bg-base-100 drop-shadow-md">
      <header class="flex justify-between container m-auto">
        <Link class="btn btn-ghost normal-case" href="/">
          Logo
        </Link>
        <nav class="flex gap-2">
          <Link class="btn btn-ghost normal-case" href="/">
            Home
          </Link>
          <Link class="btn btn-ghost normal-case" href="/challenges">
            Challenges
          </Link>
          {userDetails.value.isLoggedIn && (
            <Link class="btn btn-ghost normal-case" href="/dashboard">
              Dashboard
            </Link>
          )}
          {userDetails.value.isLoggedIn ? (
            <UserIcon>
              <Link class="btn btn-ghost normal-case" href="/profile">
                Profile
              </Link>
              <Link
                class="btn btn-ghost normal-case"
                href="/"
                onClick$={handleLogout}
              >
                Logout
              </Link>
            </UserIcon>
          ) : (
            <>
              <Link class="btn btn-ghost normal-case" href="/login">
                Login
              </Link>
              <Link class="btn btn-ghost normal-case" href="/signup">
                Signup
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  )
})
