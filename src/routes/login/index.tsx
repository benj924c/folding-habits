import { component$, useSignal, $, useContext, useStore } from "@builder.io/qwik"
import { Link, routeLoader$, useNavigate } from "@builder.io/qwik-city"
import { Input } from "~/components/Input"
import { userDetailsContext } from "~/root"
import { supabase } from "~/utils/supabase"

export const useRedirectIfLoggedIn = routeLoader$(async ({ cookie, redirect }) => {
  const accessToken = cookie.get('my-access-token')
  const { data } = await supabase.auth.getUser(accessToken?.value)
  if (data.user != null) {
    throw redirect(
      308,
      '/dashboard'
      )
  }
})

export default component$(() => {
  const userDetails = useContext(userDetailsContext)
  const error = useStore({
    isError: false,
    message: "error",
  })
  const email = useSignal('')
  const password = useSignal('')
  const isLoading = useSignal(false)
  const navigate = useNavigate()

  const handleLogin = $(async () => {
    isLoading.value = true
    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (data.session) {
      isLoading.value = false
      userDetails.isLoggedIn = true
      userDetails.session = data.session
      navigate('/')
    }
    if (supabaseError) {
      isLoading.value = false
      error.isError = true
      error.message = supabaseError.message
    }
  })

  return (
    <>
      {error.isError && (
          <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! {error.message}</span>
        </div>
      )
      }
      <h1>Login</h1>
      <form preventdefault:submit onSubmit$={handleLogin} class="grid gap-4">
        <Input bind={email} type="text" placeholder="Username" />
        <Input bind={password} type="password" placeholder="Password" />
        <div>
          <button type="submit" class="btn btn-primary btn-wide">
            {isLoading.value ? <span class="loading loading-spinner text-neutral"></span>: "Login"}
          </button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <Link href="/signup">Don't have an account?</Link>
      </div>
    </>
  )
})