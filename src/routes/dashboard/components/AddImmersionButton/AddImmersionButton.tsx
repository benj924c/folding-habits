import {$, Slot, component$, useSignal } from "@builder.io/qwik"
import { Modal } from "~/components/Modal"
import { ImmersionForm } from "./components/ImmersionForm"
import { Button } from "~/components/Button"

interface AddImmersionSessionProps {
  refetchSupabaseData: () => void
  immersionType: "active" | "passive" | "study"
  language: string
}

export const AddImmersionButton = component$<AddImmersionSessionProps>(({
  refetchSupabaseData,
  immersionType,
  language
}) => {
  const isFormVisible = useSignal(false)

  return (
    <>
      <Button color="neutral" class="w-32 normal-case" type="button" onClick={$(() => isFormVisible.value = true)}>
        <Slot />
      </Button>
      <Modal onClose={$(() => isFormVisible.value = false)} isVisible={isFormVisible}>
        <ImmersionForm
          refetchSupabaseData={refetchSupabaseData}
          immersionType={immersionType}
          language={language}
          onClose={$(() => isFormVisible.value = false)}
        />
      </Modal>
    </>
  )
})