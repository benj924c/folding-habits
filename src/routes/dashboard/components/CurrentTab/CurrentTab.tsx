import { component$ } from "@builder.io/qwik"
import { useLocation } from "@builder.io/qwik-city"

const tabs = ["stats", "charts", "data"]

export default component$(() => {
  const location = useLocation()

  if (
    !location.url.searchParams.has("tab") ||
    !tabs.includes(location.url.searchParams.get("tab")!)
  ) {
    location.url.searchParams.set("tab", "stats")
  }

  return (
    <>
      {location.url.searchParams.get("stats") && <div>Stats</div>}
      {location.url.searchParams.has("charts") && <div>Charts</div>}
      {location.url.searchParams.has("data") && <div>Data</div>}
    </>
  )
})
