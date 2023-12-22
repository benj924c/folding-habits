import { component$, useContext } from "@builder.io/qwik"
import { currentLanguageContext } from "~/routes/dashboard"
import { useGetImmersionSessions } from "~/routes/dashboard/layout"

export default component$(() => {
  const immersion = useGetImmersionSessions()
  const currentLanguage = useContext(currentLanguageContext)

  return (
    <div class="flex justify-center">
      <div class="overflow-x-auto stats p-4 rounded-md">
        <table class="table table-xs">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Active Type</th>
              <th>Content Type</th>
              <th>Content Name</th>
              <th>Minutes Immersed</th>
            </tr>
          </thead>
          <tbody>
            {immersion.value.data?.map((immersion) => {
              if (currentLanguage.language !== immersion.language) return null
              return (
                <tr key={immersion.id}>
                  <td>{immersion.immersion_date}</td>
                  <td>{immersion.immersion_type}</td>
                  <td>{immersion.active_type}</td>
                  <td>{immersion.content_type}</td>
                  <td>{immersion.content_name}</td>
                  <td>{immersion.seconds_immersed / 60}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
