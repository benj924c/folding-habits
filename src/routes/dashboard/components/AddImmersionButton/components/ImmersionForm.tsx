import type { QRL } from "@builder.io/qwik"
import { $, component$, useContext } from "@builder.io/qwik"
import type { SubmitHandler } from "@modular-forms/qwik"
import { reset, useForm, zodForm$ } from "@modular-forms/qwik"
import { userDetailsContext } from "~/root"
import { useImmersionFormLoader } from "../../.."
import { Input } from "~/components/Input"
import { z } from "@builder.io/qwik-city"
import { Button } from "~/components/Button"
import { Select } from "~/components/Select"
import { supabaseBrowserClient } from "~/utils/supabase"

export const immersionSessionSchema = z.object({
  active_type: z.string().optional().nullable(),
  content_type: z.string(),
  content_name: z.string(),
  minutes_immersed: z.number(),
})

export type ImmersionSessionForm = z.infer<typeof immersionSessionSchema>

interface ImmersionFormProps {
  immersionType: "active" | "passive" | "study"
  language: string
  onClose: QRL
}

export const ImmersionForm = component$<ImmersionFormProps>(
  ({ immersionType, language, onClose }) => {
    // const refetchSupabaseData = useReload()
    const [immersionSessionForm, { Form, Field }] =
      useForm<ImmersionSessionForm>({
        loader: useImmersionFormLoader(),
        validate: zodForm$(immersionSessionSchema),
      })

    const userDetails = useContext(userDetailsContext)

    const handleSubmit: QRL<SubmitHandler<ImmersionSessionForm>> = $(
      async (values) => {
        const { error } = await supabaseBrowserClient
          .from("immersion_sessions")
          .insert([
            {
              immersion_type: immersionType,
              active_type: values.active_type,
              content_type: values.content_type,
              content_name: values.content_name,
              seconds_immersed: values.minutes_immersed * 60,
              user_id: userDetails.session?.user.id,
              language,
            },
          ])
        if (error) {
          console.error(error)
        } else {
          // refetchSupabaseData.submit()
          reset(immersionSessionForm)
          onClose()
        }
      },
    )

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
          <Field name="minutes_immersed" type="number">
            {(field, props) => (
              <>
                <Input
                  label="Minutes Immersed"
                  type="number"
                  {...{ value: field.value }}
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
