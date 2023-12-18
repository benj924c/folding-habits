import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useTask$,
} from "@builder.io/qwik"
import { Link, routeLoader$ } from "@builder.io/qwik-city"

import { supabaseServerClient } from "~/utils/supabase"

import Charts from "./components/Charts"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"
import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector"
import { useAddLanguage } from "./components/AddLanguageButton"
import { useAddImmersion } from "./components/AddImmersionButton/components/ImmersionForm"

import type { PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import type { InitialValues } from "@modular-forms/qwik"
import type { IUserLanguages } from "~/models/IUserLanguages"
import type { ImmersionSessionForm } from "./components/AddImmersionButton/components/ImmersionForm"
import CurrentTab from "./components/CurrentTab/CurrentTab"

export { useGetLanguages } from "./components/AddLanguageButton"
export { useRedirectIfNotLoggedIn } from "~/hooks/useRedirectIfNotLoggedIn"

export interface IsupabaseImmersionData {
  data: IImmersionSessions[] | null
  error: PostgrestError | null
}
export interface IsupabaseUserLanguagesData {
  data: IUserLanguages[] | null
  error: PostgrestError | null
}

export const useGetUserLanguages = routeLoader$(async (requestEv) => {
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data: userDetails } = await supabaseClient.auth.getUser()
  const { data, error } = await supabaseClient
    .from("user_languages")
    .select("*")
    .eq("user_id", userDetails.user?.id)
  return { data, error } as IsupabaseUserLanguagesData
})

export const useGetImmersionSessions = routeLoader$(async (requestEv) => {
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data: userDetails } = await supabaseClient.auth.getUser()
  const { data, error } = await supabaseClient
    .from("immersion_sessions")
    .select("*")
    .eq("user_id", userDetails.user?.id)
  return { data, error } as IsupabaseImmersionData
})

export const useImmersionFormLoader = routeLoader$<
  InitialValues<ImmersionSessionForm>
>(() => ({
  immersion_type: "",
  active_type: null,
  content_type: "",
  content_name: "",
  minutes_immersed: 0,
}))

export { useAddLanguage }
export { useAddImmersion }

export const currentLanguageContext = createContextId<{
  language: string | undefined
  country: string | undefined
}>("currentLanguage")

export default component$(() => {
  const immersionSessions = useGetImmersionSessions()

  const userLanguagesData = useGetUserLanguages()
  const currentLanguage = useStore({
    language: userLanguagesData.value.data?.[0]?.language,
    country: userLanguagesData.value.data?.[0]?.country_code_name,
  })

  useContextProvider(currentLanguageContext, currentLanguage)

  // TODO: Add sub route for language
  // TODO: Move current language to immersion button component
  // TODO: Add better zod validation for immersion form ie. it can't be completely empty, it can't be a negative number, number can't be too long
  // TODO: Add day counter
  // TODO: Add challenges tab

  useTask$(({ track }) => {
    currentLanguage.language = userLanguagesData.value.data?.[0]?.language
    currentLanguage.country =
      userLanguagesData.value.data?.[0]?.country_code_name
    track(() => userLanguagesData.value)
  })
  return (
    <>
      <div class="">
        <h1>Welcome to your habit dashboard {currentLanguage.country}</h1>
      </div>
      <div class="grid grid-cols-[10fr_3fr] gap-2">
        <div class="grid">
          <div class="w-full flex justify-center items-center bg-neutral drop-shadow-md gap-2 p-2 justify-self-center rounded-t-md">
            <LanguageSelector />
            <Link class="btn btn-ghost btn-md btn-wide normal-case">Stats</Link>
            <Link class="btn btn-ghost btn-md btn-wide normal-case">
              Charts
            </Link>
            <Link class="btn btn-ghost btn-md btn-wide normal-case">Data</Link>
          </div>
          <div class="rounded-b-md bg-neutral p-8 prose-base">
            <CurrentTab />
            <p>
              From here you can update your habits and see how far you've come
            </p>
            <Charts />
            {immersionSessions.value.data &&
              immersionSessions.value.data.map((item) => {
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
            <AddImmersionButton
              language={currentLanguage.language ?? ""}
              immersionType="active"
            >
              👀 Active
            </AddImmersionButton>
            <AddImmersionButton
              language={currentLanguage.language ?? ""}
              immersionType="passive"
            >
              👂🏽 Passive
            </AddImmersionButton>
            <AddImmersionButton
              language={currentLanguage.language ?? ""}
              immersionType="study"
            >
              📚 Study
            </AddImmersionButton>
          </div>
        </div>
      </div>
    </>
  )
})
