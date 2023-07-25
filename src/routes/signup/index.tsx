import type { QRL} from "@builder.io/qwik";
import { $, component$, useStore } from "@builder.io/qwik"
import { Link, routeLoader$, z } from "@builder.io/qwik-city"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"
import { supabase } from "~/utils/supabase"
import type { SubmitHandler} from "@modular-forms/qwik";
import { useForm, zodForm$, type InitialValues} from "@modular-forms/qwik"

export const useRedirectIfLoggedIn = routeLoader$(async ({ cookie, redirect }) => {
  const accessToken = cookie.get('my-access-token')
  const { data } = await supabase.auth.getUser(accessToken?.value)
  if (data.user != null) {
    throw redirect(
      308,
      '/dashboard'
      )
  }
})

export const signupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignupForm = z.infer<typeof signupFormSchema>

export const useSignupFormLoader = routeLoader$<InitialValues<SignupForm>>(() => ({
  email: "",
  password: "",
}))

export default component$(() => {
  const [signupForm, { Form, Field }] = useForm<SignupForm>({
    loader: useSignupFormLoader(),
    validate: zodForm$(signupFormSchema),
  });
  const error = useStore({
    isError: false,
    message: "error",
  })
  const success = useStore({
    isSuccess: false,
    message: "Success! You should receive an email shortly. Please click the link in the email to verify your account.",
  })


  const handleSignup: QRL<SubmitHandler<SignupForm>> = $(async ( values ) => {
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })
    if (supabaseError) {
      error.isError = true
      error.message = supabaseError.message
    }
    if (data.user) {
      success.isSuccess = true
    }
  })

  // TODO: Fix error and success messages, use dialog component (make it) so it doesn't do a layout shift
  return (
    <>
      {error.isError && (
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! {error.message}</span>
        </div>
      )
      }
      {success.isSuccess && (
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{success.message}</span>
        </div>
      )}
      <h1>Sign up</h1>
      <div class="grid gap-4">
        <Form onSubmit$={handleSignup} class="grid gap-4">
          <Field name="email">
            {( field, props ) => (
              <>
                <Input
                  type="text"
                  placeholder="Email"
                  {...props}
                  {...field}
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Field name="password">
            {( field, props ) => (
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
            isLoading={signupForm.submitting}
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