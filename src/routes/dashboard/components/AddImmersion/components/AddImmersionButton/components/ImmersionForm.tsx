import type { QRL } from "@builder.io/qwik"
import {
  $,
  NoSerialize,
  component$,
  noSerialize,
  useSignal,
} from "@builder.io/qwik"
import type { SubmitHandler } from "@modular-forms/qwik"
import { reset, toCustom$, useForm, zodForm$ } from "@modular-forms/qwik"
import { useImmersionFormLoader } from "~/routes/dashboard"
import { routeAction$, z, zod$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"
import { Select } from "~/components/Select"
import IMask, { type InputMask } from "imask"

export const immersionSessionSchema = z.object({
  active_type: z.string().optional().nullable(),
  content_type: z.string(),
  content_name: z.string(),
  minutes_immersed: z.string(),
})

export type ImmersionSessionForm = z.infer<typeof immersionSessionSchema>

// eslint-disable-next-line
export const useAddImmersion = routeAction$(
  async ({ immersionType, language, values }, requestEv) => {
    const supabaseClient = await supabaseServerClient(requestEv)

    const { data: userData } = await supabaseClient.auth.getUser()
    const { error } = await supabaseClient.from("immersion_sessions").insert([
      {
        immersion_type: immersionType,
        active_type: values.active_type,
        content_type: values.content_type,
        content_name: values.content_name,
        seconds_immersed: Number(values.minutes_immersed) * 60,
        user_id: userData.user?.id,
        language,
      },
    ])

    if (error) {
      console.error(error)
      return { error }
    }
    return { error: null }
  },
  zod$({
    immersionType: z.enum(["active", "passive", "study"]),
    language: z.string(),
    values: immersionSessionSchema,
  }),
)

interface ImmersionFormProps {
  immersionType: "active" | "passive" | "study"
  language: string
  onClose: QRL
}

export const ImmersionForm = component$<ImmersionFormProps>(
  ({ immersionType, language, onClose }) => {
    const [immersionSessionForm, { Form, Field }] =
      useForm<ImmersionSessionForm>({
        loader: useImmersionFormLoader(),
        validate: zodForm$(immersionSessionSchema),
      })

    const addImmersion = useAddImmersion()
    const mask = useSignal<NoSerialize<
      InputMask<{
        mask: NumberConstructor
        min: number
        max: number
        scale: number
      }>
    > | null>(null)

    const handleSubmit: QRL<SubmitHandler<ImmersionSessionForm>> = $(
      async (values) => {
        const { value } = await addImmersion.submit({
          immersionType,
          language,
          values,
        })

        if (value.error) {
          console.error(value.error)
        } else {
          console.log("Immersion added")
          reset(immersionSessionForm)
          if (mask.value) {
            mask.value.value = ""
            mask.value.destroy()
          }
          onClose()
        }
      },
    )

    console.log(mask.value)

    // TODO: Add error handling in case something goes wrong
    // TODO: Something is wrong with the value in active_type, it gives error when I try to change it

    return (
      <div class="grid justify-center gap-2 pb-8">
        <h3 class="mt-[0.6rem]">Add Immersion</h3>
        <Form onSubmit$={handleSubmit} class="grid gap-4">
          {immersionType === "active" && (
            <Field name="active_type">
              {(field, props) => (
                <>
                  <Select
                    label="Type of Active"
                    value={field.value}
                    {...props}
                    placeholder="Type of Active"
                    options={[
                      { label: "Intensive", value: "intensive" },
                      { label: "Free flow", value: "free_flow" },
                    ]}
                  />
                  {field.error && <div>{field.error}</div>}
                </>
              )}
            </Field>
          )}
          <Field name="content_type">
            {(field, props) => (
              <>
                <Input
                  label="Type of content"
                  type="text"
                  {...{ value: field.value }}
                  {...props}
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Field name="content_name">
            {(field, props) => (
              <>
                <Input
                  label="Content Name"
                  type="text"
                  {...{ value: field.value }}
                  {...props}
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Field name="minutes_immersed">
            {(field, props) => (
              <>
                <Input
                  onFocus$={(event: FocusEvent) => {
                    if (event.target instanceof HTMLInputElement === false)
                      return
                    if (mask.value) {
                      mask.value.destroy()
                      mask.value = null
                    }
                    mask.value = noSerialize(
                      IMask(event.target, {
                        mask: Number,
                        min: 1,
                        max: 999,
                        scale: 0,
                      }),
                    )
                  }}
                  autoComplete="off"
                  label="Minutes Immersed"
                  type="text"
                  inputMode="numeric"
                  {...props}
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Button
            type="submit"
            class="btn-wide"
            isLoading={immersionSessionForm.submitting}
          >
            Add
          </Button>
        </Form>
      </div>
    )
  },
)
