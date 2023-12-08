import type { Signal } from "@builder.io/qwik"
import { component$ } from "@builder.io/qwik"
import "@flags"
import AddLanguageButton from "../AddLanguageButton"
export interface LanguageSelectorProps {
  country?: string
  userLanguages: Signal
}

export const LanguageSelector = component$<LanguageSelectorProps>(
  ({ country }) => {
    const flag = country ?? "dk"
    // TODO: Map over user's languages and display them
    // TODO: Add a button to add a language (take the one you already made)
    // TODO: Add a button to remove a language (maybe a trash can icon on hover)
    return (
      <>
        <div class="dropdown dropdown-right">
          <button class="w-14 h-14">
            <span class={`fi fi-${flag} fis text-5xl mask mask-circle`} />
          </button>
          <div
            tabIndex={0}
            class="dropdown-content z-[1] shadow bg-base-100 rounded-box flex gap-2 p-2 align-middle"
          >
            <button>
              <span class="fi fi-gr fis text-5xl mask mask-circle" />
            </button>
            <AddLanguageButton />
          </div>
        </div>
      </>
    )
  },
)
