import { $, component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { userDetailsContext } from "~/root";
import { supabase } from "~/utils/supabase";
import { UserIcon } from "./components/UserIcon";

export const Header = component$(() => {
  const userDetails = useContext(userDetailsContext)

  const handleLogout = $(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
    } else {
      userDetails.isLoggedIn = false
      userDetails.session = null
    }
  })

  return (
    <div class="navbar bg-base-100 drop-shadow-md">
      <header class="flex justify-between container m-auto">
        <Link class="btn btn-ghost normal-case" href="/" >Logo</Link>
        <nav class="flex gap-2">
          <Link class="btn btn-ghost normal-case" href="/">Home</Link>
          {userDetails.isLoggedIn && (
            <Link class="btn btn-ghost normal-case" href="/dashboard">Dashboard</Link>
            )}
          {userDetails.isLoggedIn ? (
            <UserIcon>
              <Link class="btn btn-ghost normal-case" href="/profile">Profile</Link>
              <Link class="btn btn-ghost normal-case" href="/" onClick$={handleLogout}>Logout</Link>
            </UserIcon>
            ) : (
              <>
              <Link class="btn btn-ghost normal-case" href="/login">Login</Link>
              <Link class="btn btn-ghost normal-case" href="/signup">Signup</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  )
})