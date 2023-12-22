import { component$ } from "@builder.io/qwik"
import { AddImmersionButton } from "./components/AddImmersionButton/AddImmersionButton"

export default component$(() => {
  return (
    <div class="absolute w-0">
      {/*
    // TODO: Refactor this into a component
    // TODO: Place this component absolutely to avoid page shift
    // TODO: Make buttons circular, no text and with info on hover
  */}
      <div class="pl-2 flex flex-col gap-2">
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
