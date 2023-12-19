import { component$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"

import Charts from "./components/Charts"
import Stats from "./components/Stats"
import Data from "./components/Data"

const tabs = ["stats", "charts", "data"] as const

type TabType = (typeof tabs)[number]

export const useCurrentTab = routeLoader$(({ params, redirect }) => {
  if (tabs.includes(params.tab as TabType)) {
    return params.tab as TabType
  }
  throw redirect(301, "/dashboard/stats")
})

export default component$(() => {
  const currentTab = useCurrentTab()
  return (
    <>
      {currentTab.value === "stats" && <Stats />}
      {currentTab.value === "charts" && <Charts />}
      {currentTab.value === "data" && <Data />}
    </>
  )
})
