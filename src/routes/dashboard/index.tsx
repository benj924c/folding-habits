import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik"
import { type ImmersionSessionForm } from "./components/AddImmersionButton/components/ImmersionForm"
import { supabase } from "~/utils/supabase"
import { type PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import { routeLoader$ } from "@builder.io/qwik-city"
import { type InitialValues} from "@modular-forms/qwik"
import Charts from "./components/Charts"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"
import AddLanguageButton from "./components/AddLanguageButton"
import { createServerClient } from "supabase-auth-helpers-qwik"
import { userDetailsContext } from "~/root"


export interface IsupabaseData {
  data: IImmersionSessions[] | null
  error: PostgrestError | null
}

export const useRedirectIfLoggedIn = routeLoader$(async ({ cookie, redirect }) => {
  const accessToken = cookie.get('my-access-token')
  const { data } = await supabase.auth.getUser(accessToken?.value)
  if (data.user == null) {
    throw redirect(
      308,
      '/login'
      )
  }
})

export const useGetLanguages = routeLoader$(async (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get("SUPABASE_URL")!,
    requestEv.env.get("SUPABASE_ANON_KEY")!,
    requestEv
  )
  const { data, error } = await supabaseClient.from('languages').select('*')
  return { data, error}
})

export const useGetUserLanguages = routeLoader$(async (requestEv) => {
  const { cookie } = requestEv
  const accessToken = cookie.get('my-access-token')
  const supabaseClient = createServerClient(
    requestEv.env.get("SUPABASE_URL")!,
    requestEv.env.get("SUPABASE_ANON_KEY")!,
    requestEv
  )
  const { data: userDetails } = await supabaseClient.auth.getUser(accessToken?.value)
  const { data, error } = await supabaseClient.from('user_languages').select('*').eq('user_id', userDetails.user?.id)
  return { data, error}
})

export const useGetImmersionSessions = routeLoader$(async (requestEv) => {
  const { cookie } = requestEv
  const accessToken = cookie.get('my-access-token')
  const supabaseClient = createServerClient(
    requestEv.env.get("SUPABASE_URL")!,
    requestEv.env.get("SUPABASE_ANON_KEY")!,
    requestEv
  )
  const { data: userDetails } = await supabaseClient.auth.getUser(accessToken?.value)
  const { data, error } = await supabaseClient.from('immersion_sessions').select('*').eq('user_id', userDetails.user?.id)
  return { data, error}
})

export const useImmersionFormLoader = routeLoader$<InitialValues<ImmersionSessionForm>>(() => ({
  immersion_type: "",
  active_type: null,
  content_type: "",
  content_name: "",
  minutes_immersed: 0,
}))

export const immersionDataContext = createContextId<IsupabaseData>("immersionData")

export default component$(() => {
  const immersionSessions = useGetImmersionSessions()
  const supabaseData = useStore<IsupabaseData>({ data: immersionSessions.value.data as IImmersionSessions[], error: immersionSessions.value.error })
  useContextProvider(immersionDataContext, supabaseData)
  const userLanguagesData = useGetUserLanguages()
  const userLanguages = useSignal(userLanguagesData.value)
  const currentLanguage = useSignal(userLanguages.value.data?.[0]?.language)
  const userDetails = useContext(userDetailsContext)
  const refetchSupabaseData = $(async ()=> {
    const { data, error } = await supabase
    .from('immersion_sessions')
    .select('*')
    supabaseData.data = data as IImmersionSessions[]
    supabaseData.error = error
  })

  const refetchUserLanguages = $(async ()=> {
    const { data, error } = await supabase.from('user_languages').select('*').eq('user_id', userDetails.session?.user.id)
    userLanguages.value = { data, error }
  })

  // TODO: Consider using a context for the currentLanguage over prop drilling
  // TODO: Fix design of the add immersion buttons
  // TODO: Fix whatever is wrong with the chart
  // TODO: Check if it's possible to put the chart logic in a useTask instead of useVisibleTask now that data can be loaded on the server
  return (
    <div>
      <div class="tabs">
        {userLanguages.value.data?.map((language) => (
          <button
            key={language.language}
            class={`tab tab-bordered ${currentLanguage.value === language.language ? "tab-active" : null}`}
            onClick$={$(() => currentLanguage.value = language.language)}
          >
            {language.language}
          </button>
        ))}
        <AddLanguageButton refetchLanguages={refetchUserLanguages}/>
      </div>
      <div class="flex">
        <div class="rounded-b-md bg-neutral p-8">
          <h1>Welcome to your habit dashboard</h1>
          <p>From here you can update your habits and see how far you've come</p>
          <Charts />
          {supabaseData.data && supabaseData.data.map((item) => {
            return (
              <div key={item.id} class="flex gap-4">
                <p>{item.content_name}</p>
                <p>{item.seconds_immersed / 60}</p>
              </div>
              )
            })}
        </div>
        <div class="relative">
          <div class="rounded-l-none absolute join join-vertical bg-neutral p-2">
            <AddImmersionButton language={currentLanguage.value} immersionType="active" refetchSupabaseData={refetchSupabaseData}>
              👀 Active
            </AddImmersionButton>
            <AddImmersionButton language={currentLanguage.value} immersionType="passive" refetchSupabaseData={refetchSupabaseData}>
              👂🏽 Passive
            </AddImmersionButton>
            <AddImmersionButton language={currentLanguage.value} immersionType="study" refetchSupabaseData={refetchSupabaseData}>
              📚 Study
            </AddImmersionButton>
          </div>
        </div>
      </div>
    </div>
  )
})