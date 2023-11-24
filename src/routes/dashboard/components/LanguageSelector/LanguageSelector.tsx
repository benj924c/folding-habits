import { component$, useSignal, useTask$ } from "@builder.io/qwik"
import { Image } from "@unpic/qwik"
export interface LanguageSelectorProps {
  country: string
}

export const LanguageSelector = component$<LanguageSelectorProps>(
  ({ country }) => {
    const isSelectorOpen = useSignal(false)

    useTask$(async ({ track }) => {
      track(() => country)
      try {
        const RestCountry = await fetch(
          "https://restcountries.com/v3.1/name/" + country,
        )
        const RestCountryJson = await RestCountry.json()
        // console.log(RestCountryJson)
      } catch (e) {
        console.error(e)
      }
    })

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
            <Image
              class="m-0 mask mask-circle"
              src="https://flagcdn.com/w320/dk.png"
              width="56"
              aspectRatio="1/1"
              layout="constrained"
            />
          </button>
          {isSelectorOpen.value && (
            <div class="absolute right-[-100%]">
              <Image
                class="m-0 mask mask-circle"
                src="https://flagcdn.com/w320/dk.png"
                width="56"
                aspectRatio="1/1"
                layout="constrained"
              />
            </div>
          )}
        </div>
      </>
    )
  },
)
