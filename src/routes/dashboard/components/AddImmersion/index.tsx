import { component$ } from "@builder.io/qwik"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"

export default component$(() => {
  return (
    <div class="pl-2 flex lg:flex-col gap-2 justify-end lg:justify-start">
      <AddImmersionButton
        tooltip="Add an active immersion session"
        immersionType="active"
      >
        👀
      </AddImmersionButton>
      <AddImmersionButton
        tooltip="Add a passive immersion session"
        immersionType="passive"
      >
        👂🏽
      </AddImmersionButton>
      <AddImmersionButton
        tooltip="Add a study immersion session"
        immersionType="study"
      >
        📚
      </AddImmersionButton>
    </div>
  )
})
