import type { Signal } from "@builder.io/qwik"
import { component$ } from "@builder.io/qwik"

import Charts from "./Charts"
import Stats from "./Stats"
import Data from "./Data"

export const tabs = ["stats", "charts", "data"] as const

export type TabType = (typeof tabs)[number]

export default component$(({ tab }: { tab: Signal<TabType> }) => {
  return (
    <>
      {tab.value === "stats" && <Stats />}
      {tab.value === "charts" && <Charts />}
      {tab.value === "data" && <Data />}
    </>
  )
})
