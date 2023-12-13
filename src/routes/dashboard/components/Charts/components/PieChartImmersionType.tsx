import {
  component$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik"
import { Chart } from "chart.js/auto"
import { useGetImmersionSessions } from "~/routes/dashboard"

export const PieChartImmersionType = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  const immersionSessions = useGetImmersionSessions()

  const immersionTotal = useStore({
    activeTotal: 0,
    passiveTotal: 0,
    studyTotal: 0,
  })
  if (immersionSessions.value.data == null) {
    return <div>Loading</div>
  }

  useTask$(({ track }) => {
    track(() => immersionSessions.value)
    immersionTotal.activeTotal = 0
    immersionTotal.passiveTotal = 0
    immersionTotal.studyTotal = 0

    immersionSessions.value.data?.forEach((session) => {
      if (session.immersion_type === "active") {
        immersionTotal.activeTotal += session.seconds_immersed / 60
      }
      if (session.immersion_type === "passive") {
        immersionTotal.passiveTotal += session.seconds_immersed / 60
      }
      if (session.immersion_type === "study") {
        immersionTotal.studyTotal += session.seconds_immersed / 60
      }
    })
  })

  const mytheme = {
    primary: "#ff7ac6",
    secondary: "#bf95f9",
    accent: "#ffb86b",
    neutral: "#414558",
    "base-100": "#272935",
    info: "#8be8fd",
    success: "#52fa7c",
    warning: "#f1fa89",
    error: "#ff5757",
  }

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(
      () => (
        immersionTotal.activeTotal,
        immersionTotal.passiveTotal,
        immersionTotal.studyTotal
      ),
    )
    const pieChart = new Chart(canvasRef.value ?? "", {
      type: "doughnut",
      data: {
        labels: ["Active Immersion", "Passive Listening", "Active Study"],
        datasets: [
          {
            label: "Minutes Immersed",
            data: [
              immersionTotal.activeTotal,
              immersionTotal.passiveTotal,
              immersionTotal.studyTotal,
            ],
            backgroundColor: [
              mytheme["primary"],
              mytheme["secondary"],
              mytheme["accent"],
            ],
            borderColor: mytheme["neutral"],
            borderWidth: 3,
          },
        ],
      },
    })
    pieChart.update()
    cleanup(() => pieChart.destroy())
  })

  return (
    <>
      <div class="w-[25rem] h-[25rem]">
        <canvas class="w-full h-full" ref={canvasRef} />
      </div>
    </>
  )
})
