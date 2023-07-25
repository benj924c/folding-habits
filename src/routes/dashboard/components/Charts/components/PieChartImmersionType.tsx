import { component$, useContext, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import { Chart } from "chart.js/auto"
import { immersionDataContext } from "~/routes/dashboard"

export const PieChartImmersionType = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  const immersionData = useContext(immersionDataContext)

  const immersionTotal = useStore({
    activeTotal: 0,
    passiveTotal: 0,
    studyTotal: 0,
  })
  if (immersionData.data == null) {
    return (
      <div>Loading</div>
    )
  }

  useTask$(({ track }) => {
    track(() => (immersionData.data))
    immersionTotal.activeTotal = 0
    immersionTotal.passiveTotal = 0
    immersionTotal.studyTotal = 0

    immersionData.data?.forEach((session) => {
      if (session.immersion_type === 'active') {
        immersionTotal.activeTotal += (session.seconds_immersed / 60)
      }
      if (session.immersion_type === 'passive') {
        immersionTotal.passiveTotal += (session.seconds_immersed / 60)
      }
      if (session.immersion_type === 'study') {
        immersionTotal.studyTotal += (session.seconds_immersed / 60)
      }
    })
  })

  useVisibleTask$(({ track, cleanup }) => {
    track(() => (immersionTotal.activeTotal, immersionTotal.passiveTotal, immersionTotal.studyTotal ))

    const pieChart = new Chart(canvasRef.value ?? "", {
      type: "doughnut",
      data: {
        labels: ['Active Immersion', 'Passive Listening', 'Active Study'],
        datasets: [{
          label: 'Minutes Immersed',
          data: [immersionTotal.activeTotal, immersionTotal.passiveTotal, immersionTotal.studyTotal],
        }]
      },
    })
    pieChart.update()
    cleanup(() => pieChart.destroy())
  })

  return(
    <>
      <div class="w-[25rem]">
        <canvas class="w-full h-full" ref={canvasRef}/>
      </div>
    </>
  )
})