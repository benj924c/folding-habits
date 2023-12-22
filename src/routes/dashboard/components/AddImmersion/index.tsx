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
        <AddImmersionButton immersionType="active">👀</AddImmersionButton>
        <AddImmersionButton immersionType="passive">👂🏽</AddImmersionButton>
        <AddImmersionButton immersionType="study">📚</AddImmersionButton>
      </div>
    </div>
  )
})
