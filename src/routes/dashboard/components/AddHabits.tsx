import { $, component$, useContext, useSignal } from "@builder.io/qwik"
import { userDetailsContext } from "~/root"
import { supabase } from "~/utils/supabase"


export const AddHabits = component$(() => {
  const userDetails = useContext(userDetailsContext)
  const contentType = useSignal("")
  const contentTypeError = useSignal(false)

  const contentName = useSignal("")
  const contentNameError = useSignal(false)

  const activeType = useSignal("")

  const immersionType = useSignal("")
  const immersionTypeError = useSignal(false)

  const timeImmersed = useSignal(0)
  const timeImmersedError = useSignal(false)

  const handleSubmit = $(async () => {
    contentType.value === "" ? contentTypeError.value = true : contentTypeError.value = false
    contentName.value === "" ? contentNameError.value = true : contentNameError.value = false
    immersionType.value === "" ? immersionTypeError.value = true : immersionTypeError.value = false
    timeImmersed.value === 0 ? timeImmersedError.value = true : timeImmersedError.value = false

    if (contentTypeError.value || contentNameError.value || immersionTypeError.value || timeImmersedError.value) return

    const { error } = await supabase
      .from("immersion_sessions")
      .insert([
        {
          immersion_type: immersionType.value,
          active_type: activeType.value,
          content_type: contentType.value,
          content_name: contentName.value,
          seconds_immersed: timeImmersed.value * 60,
          user_id: userDetails.session?.user.id
        }
      ])
    if (error) {
      console.error(error)
    }
  })

  return (
    <div class="grid justify-center gap-2">
      <h3>Add Immersion</h3>
      <form preventdefault:submit onsubmit$={handleSubmit}>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Type of content</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            class={`input input-bordered ${!contentTypeError.value ? "input-primary" : "input-error"} w-full max-w-xs`}
            bind:value={contentType}
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Content Name</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            class={`input input-bordered ${!contentNameError.value ? "input-primary" : "input-error"} w-full max-w-xs`}
            bind:value={contentName}
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Type of immersion</span>
          </label>
          <select
            class={`select ${!immersionTypeError.value ? "select-primary" : "select-error"} w-full max-w-xs`}
            bind:value={immersionType}
          >
            <option disabled selected>Type of immersion</option>
            <option>Active Immersion</option>
            <option>Passive Listening</option>
            <option>Active Study</option>
          </select>
        </div>
        {immersionType.value === "Active Immersion" && (
          <div class="form-control">
            <label class="label">
              <span class="label-text">Type of active immersion</span>
            </label>
            <select
              class="select select-primary w-full max-w-xs"
              bind:value={activeType}
            >
              <option disabled selected>Type of immersion</option>
              <option>Intensive</option>
              <option>Free flow</option>
            </select>
          </div>)}
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">How much time did you immerse? (min)</span>
            </label>
            <input
              type="number"
              placeholder="0"
              class={`input input-bordered ${!timeImmersedError.value ? "input-primary" : "input-error"} w-full max-w-xs`}
              onChange$={(e) => timeImmersed.value = parseInt(e.target.value)}
            />
          </div>
        <button type="submit" class="btn btn-primary btn-wide mt-4">Add</button>
      </form>
    </div>
  )})