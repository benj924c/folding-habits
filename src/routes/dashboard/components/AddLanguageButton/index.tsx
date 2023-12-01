import { $, component$, useContext, useSignal } from "@builder.io/qwik"
import { Button } from "~/components/Button"
import { Modal } from "~/components/Modal"
import { Select } from "~/components/Select"
import { useGetLanguages, useReload } from "../.."
import { userDetailsContext } from "~/root"
import { supabaseBrowserClient } from "~/utils/supabase"

export interface AddLanguageButtonProps {}

export default component$<AddLanguageButtonProps>(() => {
  const refetchLanguages = useReload()
  const isModalVisible = useSignal(false)
  const languages = useGetLanguages()
  const selectedLanguage = useSignal("")
  const userDetails = useContext(userDetailsContext)
  const isError = useSignal(false)

  // TODO: use serverclient instead and make use of a route action
  const handleClickAdd = $(async () => {
    const { error } = await supabaseBrowserClient
      .from("user_languages")
      .insert({
        user_id: userDetails.session?.user.id,
        language: selectedLanguage.value,
        country_code_name: selectedLanguage.value,
      })
    if (error) {
      console.error(error)
      isError.value = true
    } else {
      refetchLanguages.submit()
      isModalVisible.value = false
      isError.value = false
    }
  })
  if (languages.value.data == null) return null
  return (
    <>
      <button
        class="flex items-center justify-center text-3xl p-2 w-10 h-10 rounded-full hover:bg-secondary-content transition-all"
        onClick$={$(() => (isModalVisible.value = true))}
      >
        +
      </button>
      <Modal
        isVisible={isModalVisible}
        onClose={$(() => (isModalVisible.value = false))}
      >
        <div class="flex gap-4 w-full justify-center items-end mb-16">
          <Select
            bind={selectedLanguage}
            options={languages.value.data
              .filter((country) => country.lang_code)
              .sort((a, b) => a.lang_name.localeCompare(b.lang_name))
              .map((language) => ({
                key: language.lang_code + language.lang_name,
                label: `${language.lang_name} (${language.country_name})`,
                value: language.lang_code as string,
              }))}
            label="Select a language"
            placeholder="Select a language"
          />
          {isError.value && (
            <p class="text-red-500">You've already added that language</p>
          )}
          <Button onClick={handleClickAdd}>Add</Button>
        </div>
      </Modal>
    </>
  )
})
