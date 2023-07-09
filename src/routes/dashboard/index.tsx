import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { AddHabits } from "./components/AddHabits"
import { supabase } from "~/utils/supabase"
import type { PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import { useIsLoggedIn } from "../layout"
import { routeLoader$ } from "@builder.io/qwik-city"

export interface IsupabaseData {
  data: IImmersionSessions[] | null
  error: PostgrestError | null
}

export const useRedirectIfNotLoggedIn = routeLoader$(async ({ cookie, redirect }) => {
  const accessToken = cookie.get('my-access-token')
  const { data } = await supabase.auth.getUser(accessToken?.value)
  if (data.user == null) {
    throw redirect(
      308,
      '/login'
      )
  }
})

export default component$(() => {
  const isLoggedIn = useIsLoggedIn()

  const supabaseData = useStore<IsupabaseData>({ data: null, error: null })

  useVisibleTask$(async ()=> {
    const { data, error } = await supabase
      .from('immersion_sessions')
      .select('*')
    supabaseData.data = data as IImmersionSessions[]
    supabaseData.error = error
  })

  return (
    <>
      {isLoggedIn.value ? <p>Logged in</p> : <p>Not logged in</p>}
      <div class="container">
        <h1>Welcome to your habit dashboard</h1>
        <p>From here you can update your habits and see how far you've come</p>
        {supabaseData.data && supabaseData.data.map((item) => {
          return (
            <p key={item.id}>{item.content_name}</p>
            )
          })}
        <AddHabits />
      </div>
    </>
  )
})