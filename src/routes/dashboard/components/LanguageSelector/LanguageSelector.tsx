import { $, component$, useContext } from "@builder.io/qwik"
import "@flags"
import AddLanguageButton from "../AddLanguageButton"
import { currentLanguageContext, useGetUserLanguages } from "../.."

export const LanguageSelector = component$(() => {
  const currentLanguage = useContext(currentLanguageContext)
  const userLanguagesData = useGetUserLanguages()
  const handleClick = $(
    ({ country, language }: { country: string; language: string }) => {
      currentLanguage.country = country
      currentLanguage.language = language
    },
  )

  // TODO: Add a button to remove a language (maybe a trash can icon on hover)
  return (
    <>
      <div class="dropdown dropdown-right">
        <button class="w-14 h-14 hover:scale-105 transition-all btn btn-circle bg-slate-800 border-0">
          {currentLanguage.country != null ? (
            <span
              class={`fi fi-${currentLanguage.country} fis text-5xl mask mask-circle`}
            />
          ) : (
            <span class="text-5xl mask mask-circle btn btn-neutral">?</span>
          )}
        </button>
        <div
          tabIndex={0}
          class="dropdown-content z-[1] shadow bg-base-100 rounded-box flex gap-2 p-2 align-middle"
        >
          {userLanguagesData.value.data?.map((language) => {
            if (language.country_code_name === currentLanguage.country)
              return null
            return (
              <button
                class="hover:scale-105 transition-all"
                key={language.country_code_name}
                onClick$={() =>
                  handleClick({
                    country: language.country_code_name,
                    language: language.language,
                  })
                }
              >
                <span
                  class={`fi fi-${language.country_code_name} fis text-5xl mask mask-circle`}
                />
              </button>
            )
          })}
          <AddLanguageButton />
        </div>
      </div>
    </>
  )
})
