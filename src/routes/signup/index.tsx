import type { QRL } from "@builder.io/qwik"
import { $, component$ } from "@builder.io/qwik"
import {
  Link,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"
import type { SubmitHandler } from "@modular-forms/qwik"
import { useForm, zodForm$, type InitialValues } from "@modular-forms/qwik"
import { supabaseServerClient } from "~/utils/supabase"

export { useRedirectIfLoggedIn } from "~/hooks/useRedirectIfLoggedIn"

export const signupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignupForm = z.infer<typeof signupFormSchema>

export const useSignupFormLoader = routeLoader$<InitialValues<SignupForm>>(
  () => ({
    email: "",
    password: "",
  }),
)

export const useSignup = routeAction$(async (values, requestEv) => {
  const supabaseClient = supabaseServerClient(requestEv)
  const { data, error } = await (
    await supabaseClient
  ).auth.signUp({
    email: values.email,
    password: values.password,
  })
  if (error) {
    return { error: error.message }
  }
  return { data }
}, zod$(signupFormSchema))

export default component$(() => {
  const [signupForm, { Form, Field }] = useForm<SignupForm>({
    loader: useSignupFormLoader(),
    validate: zodForm$(signupFormSchema),
  })
  const signUp = useSignup()

  const handleSignup: QRL<SubmitHandler<SignupForm>> = $((values) => {
    signUp.submit(values)
  })
  // TODO: Make toast disappear after a few seconds and able to be closed
  return (
    <>
      <div class="toast toast-top toast-center">
        {signUp.value?.error && (
          <div class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! {signUp.value.error}</span>
          </div>
        )}
        {signUp.value?.data && (
          <div class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Success! You should receive an email shortly. Please click the
              link in the email to verify your account.
            </span>
          </div>
        )}
      </div>
      <h1>Sign up</h1>
      <div class="grid gap-4">
        <Form onSubmit$={handleSignup} class="grid gap-4">
          <Field name="email">
            {(field, props) => (
              <>
                <Input type="text" placeholder="Email" {...props} {...field} />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <>
                <Input
                  type="password"
                  placeholder="Password"
                  {...props}
                  {...field}
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Button
            type="submit"
            isLoading={signupForm.submitting || signUp.isRunning}
            class="btn-wide"
          >
            Sign up
          </Button>
        </Form>
        <div class="mt-4 text-center">
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </div>
    </>
  )
})
