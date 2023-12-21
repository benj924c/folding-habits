import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useTask$,
  $,
  useSignal,
} from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"

import { supabaseServerClient } from "~/utils/supabase"

import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"
import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector"
import { useAddLanguage } from "./components/AddLanguageButton"
import { useAddImmersion } from "./components/AddImmersionButton/components/ImmersionForm"

import type { PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import type { InitialValues } from "@modular-forms/qwik"
import type { IUserLanguages } from "~/models/IUserLanguages"
import type { ImmersionSessionForm } from "./components/AddImmersionButton/components/ImmersionForm"
import { Button } from "~/components/Button"
import type { TabType } from "./components/Tabs"
import Tabs from "./components/Tabs"

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
  const userLanguagesData = useGetUserLanguages()
  const currentLanguage = useStore({
    language: userLanguagesData.value.data?.[0]?.language,
    country: userLanguagesData.value.data?.[0]?.country_code_name,
  })

  const currentTab = useSignal<TabType>("stats")

  useContextProvider(currentLanguageContext, currentLanguage)
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
    <div>
      <div class="">
        <h1>Welcome to your habit dashboard {currentLanguage.country}</h1>
      </div>
      {/*
        // TODO: This shouldn't be a grid as it's causing layout shift
        // TODO: Make mobile friendly
      */}
      <div class="grid grid-cols-[10fr_3fr] gap-2">
        <div class="grid">
          <div class="w-full flex justify-center items-center bg-neutral drop-shadow-md gap-2 p-2 justify-self-center rounded-t-md">
            <LanguageSelector />
            <Button
              onClick={$(() => (currentTab.value = "stats"))}
              class="btn btn-ghost btn-md btn-wide normal-case"
            >
              Stats
            </Button>
            <Button
              onClick={$(() => (currentTab.value = "charts"))}
              class="btn btn-ghost btn-md btn-wide normal-case"
            >
              Charts
            </Button>
            <Button
              onClick={$(() => (currentTab.value = "data"))}
              class="btn btn-ghost btn-md btn-wide normal-case"
            >
              Data
            </Button>
          </div>
          <div class="rounded-b-md bg-neutral p-8 prose-base">
            <Tabs tab={currentTab} />
          </div>
        </div>
        <div>
          <div class="rounded-t-md bg-neutral-focus prose-h3:m-1 flex align-middle justify-center p-3">
            <h3>Add immersion</h3>
          </div>
          {/*
            // TODO: Refactor this into a component
            // TODO: Place this component absolutely to avoid page shift
            // TODO: Make buttons circular, no text and with info on hover
          */}
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
    </div>
  )
})
