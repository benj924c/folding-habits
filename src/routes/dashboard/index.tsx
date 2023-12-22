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

import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector"

import { Button } from "~/components/Button"
import Tabs from "./components/Tabs"
import AddImmersion from "./components/AddImmersion"

import type { PostgrestError } from "@supabase/supabase-js"
import type { IImmersionSessions } from "~/models/IImmersionSessions"
import type { InitialValues } from "@modular-forms/qwik"
import type { IUserLanguages } from "~/models/IUserLanguages"
import type { ImmersionSessionForm } from "./components/AddImmersion/components/AddImmersionButton/components/ImmersionForm"
import type { TabType } from "./components/Tabs"

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
      <div class="flex justify-end">
        <div>
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
          <div class="rounded-b-md bg-neutral  p-8">
            <Tabs tab={currentTab} />
          </div>
        </div>
        {currentLanguage.language && <AddImmersion />}
      </div>
    </div>
  )
})
