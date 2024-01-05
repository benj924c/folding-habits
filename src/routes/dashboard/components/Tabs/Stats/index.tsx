import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik"

import Stat from "./components/Stat"

import { LuRocket } from "@qwikest/icons/lucide"

import { useGetImmersionSessions } from "~/routes/dashboard/layout"
import { currentLanguageContext } from "~/routes/dashboard"

export default component$(() => {
  const langugage = useContext(currentLanguageContext)
  const immersionSessions = useGetImmersionSessions()
  const daysImmersed = useSignal(0)
  const timeImmersed = useSignal(0)

  useTask$(({ track }) => {
    track(() => langugage.language)
    const uniqueDays = new Set()
    immersionSessions.value.data?.forEach((immersion) => {
      if (langugage.language === immersion.language) {
        uniqueDays.add(immersion.immersion_date)
      }
    })
    daysImmersed.value = uniqueDays.size

    timeImmersed.value =
      immersionSessions.value.data?.reduce((acc, curr) => {
        if (langugage.language === curr.language) {
          return acc + curr.seconds_immersed
        }
        return acc
      }, 0) ?? 0
  })

  return (
    <div class="prose flex justify-center min-w-fit">
      <div class="stats stats-vertical lg:stats-horizontal shadow">
        <Stat
          title="Days of Immersion"
          desc="Number of days"
          icon={<LuRocket class="h-8 w-8" />}
        >
          <div class="stat-value text-primary">{daysImmersed.value}</div>
        </Stat>
        <Stat
          title="Total Immersion Time"
          desc="Time in minutes"
          icon={<LuRocket class="h-8 w-8" />}
        >
          <div class="stat-value text-primary">{timeImmersed.value / 60}</div>
        </Stat>
        <Stat
          title="Average Immersion Time"
          desc="Average time in minutes"
          icon={<LuRocket class="h-8 w-8" />}
        >
          <div class="stat-value text-primary">
            {timeImmersed.value > 0
              ? timeImmersed.value / 60 / daysImmersed.value
              : 0}
          </div>
        </Stat>
      </div>
    </div>
  )
})
