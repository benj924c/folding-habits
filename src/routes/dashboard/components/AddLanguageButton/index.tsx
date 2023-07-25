import type { QRL} from "@builder.io/qwik";
import {$, component$, useContext, useSignal } from "@builder.io/qwik";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { Select } from "~/components/Select";
import { useGetLanguages } from "../..";
import { supabase } from "~/utils/supabase";
import { userDetailsContext } from "~/root";

export interface AddLanguageButtonProps {
  refetchLanguages: QRL
}

export default component$<AddLanguageButtonProps>(({ refetchLanguages }) => {
  const isModalVisible = useSignal(false)
  const languages = useGetLanguages()
  const selectedLanguage = useSignal("")
  const userDetails = useContext(userDetailsContext)

  const handleClickAdd = $(async() => {
    const {error} = await supabase.from("user_languages").insert({
      user_id: userDetails.session?.user.id,
      language: selectedLanguage.value,
    })
    if (error) {
      console.error(error)
    }
    refetchLanguages()
    isModalVisible.value = false
  })
  if (languages.value.data == null) return null
  return (
    <>
      <button class="tab tab-bordered" onClick$={$(() => isModalVisible.value = true)}>+</button>
      <Modal
        isVisible={isModalVisible}
        onClose={$(() => isModalVisible.value = false)}
      >
        <div class="flex gap-4 w-full justify-center items-end mb-16">
          <Select
            bind={selectedLanguage}
            options={languages.value.data.filter((country => country.lang_code)).map((language) => (
              { label: language.lang_name as string, value: language.lang_code as string }
            ))}
            label="Select a language"
            placeholder="Select a language"
          >
            {languages.value.data.filter((country => country.lang_code)).map((language) => (
                  <option key={language.id} value={language.lang_code}>{language.lang_name}</option>
              ))}
          </Select>
          <Button onClick={handleClickAdd}>Add</Button>
        </div>
      </Modal>
    </>
  )
})