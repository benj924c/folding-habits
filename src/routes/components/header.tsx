import { $, component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { userDetailsContext } from "~/root";
import { supabase } from "~/utils/supabase";

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
    <header class="flex justify-between p-8 ">
      <div>Logo</div>
      <nav class="flex gap-8">
        <Link href="/">Home</Link>
        {userDetails.isLoggedIn && (
          <Link href="/dashboard">Dashboard</Link>
        )}
        {userDetails.isLoggedIn ? (
          <Link href="/" onClick$={handleLogout}>Logout</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  )
})