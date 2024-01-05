import { component$ } from "@builder.io/qwik"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"

export default component$(() => {
  return (
    <div class="md:absolute">
      <div class="pl-2 flex sm:flex-col gap-2 justify-end">
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
    </div>
  )
})
