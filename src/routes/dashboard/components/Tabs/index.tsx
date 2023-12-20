import type { Signal } from "@builder.io/qwik"
import { component$, useTask$ } from "@builder.io/qwik"

import Charts from "./Charts"
import Stats from "./Stats"
import Data from "./Data"
import { useLocation } from "@builder.io/qwik-city"

export const tabs = ["stats", "charts", "data"] as const

export type TabType = (typeof tabs)[number]

export default component$(({ tab }: { tab: Signal<TabType> }) => {
  const location = useLocation()

  useTask$(({ track }) => {
    track(() => tab)
    location.url.searchParams.set("tab", tab.value)
  })

  return (
    <>
      {tab.value === "stats" && <Stats />}
      {tab.value === "charts" && <Charts />}
      {tab.value === "data" && <Data />}
    </>
  )
})
