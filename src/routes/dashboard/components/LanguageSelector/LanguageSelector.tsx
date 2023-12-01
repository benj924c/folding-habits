import type { Signal } from "@builder.io/qwik"
import { component$, useSignal } from "@builder.io/qwik"
import "@flags"
import AddLanguageButton from "../AddLanguageButton"
export interface LanguageSelectorProps {
  country?: string
  userLanguages: Signal
}

export const LanguageSelector = component$<LanguageSelectorProps>(
  ({ country }) => {
    const isSelectorOpen = useSignal(false)
    const flag = country ?? "dk"
    // TODO: Map over user's languages and display them
    // TODO: Add a button to add a language (take the one you already made)
    // TODO: Add a button to remove a language (maybe a trash can icon on hover)
    return (
      <>
        <div class="dropdown">
          <button
            onClick$={() => (isSelectorOpen.value = !isSelectorOpen.value)}
            class="w-14 h-14"
          >
            <span class={`fi fi-${flag} fis text-5xl mask mask-circle`} />
          </button>
          {isSelectorOpen.value && (
            <div class="absolute right-[-100%] flex gap-2">
              <span class="fi fi-gr fis text-5xl mask mask-circle" />
              <AddLanguageButton />
            </div>
          )}
        </div>
      </>
    )
  },
)
