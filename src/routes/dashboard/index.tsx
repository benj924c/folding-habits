import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik"
import { type ImmersionSessionForm } from "./components/AddImmersionButton/components/ImmersionForm"
import { supabaseBrowserClient, supabaseServerClient } from "~/utils/supabase"
import { type PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import { Link, routeLoader$ } from "@builder.io/qwik-city"
import { type InitialValues} from "@modular-forms/qwik"
import Charts from "./components/Charts"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"
import AddLanguageButton from "./components/AddLanguageButton"
import { userDetailsContext } from "~/root"
import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector"


export interface IsupabaseData {
  data: IImmersionSessions[] | null
  error: PostgrestError | null
}

export const useRedirectIfLoggedIn = routeLoader$(async (requestEv) => {
  const { redirect } = requestEv
  const supabaseClient = supabaseServerClient(requestEv)
  const { data } = await (await supabaseClient).auth.getUser()
  if (data.user == null) {
    throw redirect(
      308,
      '/login'
      )
  }
})

export const useGetLanguages = routeLoader$(async (requestEv) => {
  const supabaseClient = supabaseServerClient(requestEv)
  const { data, error } = await (await supabaseClient).from('languages').select('*')
  return { data, error}
})

export const useGetUserLanguages = routeLoader$(async (requestEv) => {
  const supabaseClient = supabaseServerClient(requestEv)
  const { data: userDetails } = await (await supabaseClient).auth.getUser()
  const { data, error } = await (await supabaseClient).from('user_languages').select('*').eq('user_id', userDetails.user?.id)
  return { data, error}
})

export const useGetImmersionSessions = routeLoader$(async (requestEv) => {
  const supabaseClient = supabaseServerClient(requestEv)
  const { data: userDetails } = await (await supabaseClient).auth.getUser()
  const { data, error } = await (await supabaseClient).from('immersion_sessions').select('*').eq('user_id', userDetails.user?.id)
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
  const currentLanguage = useStore({
    language: userLanguages.value.data?.[0]?.language,
    country: userLanguages.value.data?.[0]?.country_name
  })
  const userDetails = useContext(userDetailsContext)
  const refetchSupabaseData = $(async ()=> {
    const { data, error } = await supabaseBrowserClient
    .from('immersion_sessions')
    .select('*')
    supabaseData.data = data as IImmersionSessions[]
    supabaseData.error = error
  })

  const refetchUserLanguages = $(async ()=> {
    const { data, error } = await supabaseBrowserClient.from('user_languages').select('*').eq('user_id', userDetails.session?.user.id)
    userLanguages.value = { data, error }
  })

  // TODO: Consider using a context for the currentLanguage over prop drilling
  // TODO: Add sub route for language
  // TODO: Move language into "avatar" circle to more easily switch between languages as well as show which is active
  // TODO: Filter immersion sessions by language
  // TODO: Change chart design to be "on brand"
  // TODO: Add better zod validation for immersion form ie. it can't be completely empty, it can't be a negative number, number can't be too long
  // TODO: Add day counter
  // TODO: Add challenges tab

  return (
    <>
      <div class="">
        <h1>Welcome to your habit dashboard {currentLanguage.country}</h1>
      </div>
      <div class="grid grid-cols-[1fr_10fr_3fr] gap-2">
        <div class="flex flex-col">
          <div class="tabs">
            <AddLanguageButton refetchLanguages={refetchUserLanguages}/>
              {userLanguages.value.data?.reverse().map((language) => (
                <button
                key={language.language}
                class={`tab tab-bordered ${currentLanguage.language === language.language ? "tab-active" : null} w-full`}
                onClick$={$(() => {
                  currentLanguage.language = language.language
                  currentLanguage.country = language.country_name
                })}
                >
                  <span class="">{language.language}</span>
                </button>
              )
              )}
          </div>
        </div>
        <div class="grid">
          <div class="w-full flex justify-center items-center bg-neutral-focus gap-2 p-2 justify-self-center rounded-t-md">
            <LanguageSelector country={currentLanguage.country} />
            <Link class="btn btn-ghost btn-md btn-wide normal-case">Charts</Link>
            <Link class="btn btn-ghost btn-md btn-wide normal-case">Charts</Link>
            <Link class="btn btn-ghost btn-md btn-wide normal-case">Charts</Link>
          </div>
          <div class="rounded-b-md bg-neutral p-8 prose-base">
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
        </div>
        <div>
          <div class="rounded-t-md bg-neutral-focus prose-h3:m-1 flex align-middle justify-center p-3">
            <h3>Add immersion</h3>
          </div>
          <div class="rounded-b-md bg-neutral p-2">
            <AddImmersionButton language={currentLanguage.language} immersionType="active" refetchSupabaseData={refetchSupabaseData}>
              👀 Active
            </AddImmersionButton>
            <AddImmersionButton language={currentLanguage.language} immersionType="passive" refetchSupabaseData={refetchSupabaseData}>
              👂🏽 Passive
            </AddImmersionButton>
            <AddImmersionButton language={currentLanguage.language} immersionType="study" refetchSupabaseData={refetchSupabaseData}>
              📚 Study
            </AddImmersionButton>
          </div>
        </div>
      </div>
    </>
  )
})