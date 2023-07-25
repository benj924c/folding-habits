import { type Signal, Slot, component$, useSignal, useTask$, type QRL } from "@builder.io/qwik"

interface ModalProps {
  isVisible: Signal<boolean>
  onClose: QRL
}

export const Modal = component$<ModalProps>(({
  isVisible,
  onClose
}) => {
  const modalRef = useSignal<HTMLDialogElement>()

  useTask$(({ track }) => {
    track(() => isVisible.value)
    if (modalRef.value == null) return

    if (isVisible.value) {
      modalRef.value.showModal()
    } else {
      modalRef.value.close()
    }
  })

  return (
    <dialog ref={modalRef} class="modal">
      <div class="modal-box pb-2">
        <div class="flex justify-end p-2">
          <button onClick$={onClose} class="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
        <Slot />
      </div>
      <form onSubmit$={onClose} method="dialog" class="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  )
})