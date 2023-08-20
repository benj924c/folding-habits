import type { QRL } from "@builder.io/qwik";
import { component$, $, useContext, useStore } from "@builder.io/qwik"
import { Link, routeLoader$, useNavigate, z } from "@builder.io/qwik-city"
import type { SubmitHandler} from "@modular-forms/qwik";
import { type InitialValues, useForm, zodForm$ } from "@modular-forms/qwik"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"
import { userDetailsContext } from "~/root"
import { supabaseBrowserClient, supabaseServerClient } from "~/utils/supabase";

export const useRedirectIfLoggedIn = routeLoader$(async (requestEv) => {
  const { redirect } = requestEv
  const supabaseClient = supabaseServerClient(requestEv)
  const { data } = await (await supabaseClient).auth.getUser()
  if (data.user != null) {
    throw redirect(
      308,
      '/dashboard'
      )
  }
})

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginForm = z.infer<typeof loginFormSchema>

export const useLoginFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}))

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useLoginFormLoader(),
    validate: zodForm$(loginFormSchema),
  })

  const userDetails = useContext(userDetailsContext)
  const error = useStore({
    isError: false,
    message: "error",
  })
  const navigate = useNavigate()

  const handleLogin: QRL<SubmitHandler<LoginForm>> = $(async (values) => {
    const { data, error: supabaseError } = await supabaseBrowserClient.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (data.session) {
      userDetails.isLoggedIn = true
      userDetails.session = data.session
      navigate('/')
    }
    if (supabaseError) {
      error.isError = true
      error.message = supabaseError.message
    }
  })

  return (
    <>
      {error.isError && (
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! {error.message}</span>
        </div>
      )
      }
      <h1>Login</h1>
      <div>
        <Form onSubmit$={handleLogin} class="grid gap-4">
          <Field name="email">
            {( field, props) => (
              <Input
                placeholder="Email"
                {...field}
                {...props}
              />
            )}
          </Field>
          <Field name="password">
            {( field, props) => (
              <Input
                placeholder="Password"
                type="password"
                {...field}
                {...props}
              />
            )}
          </Field>
          <Button
            type="submit"
            isLoading={loginForm.submitting}
            class="btn-wide"
          >
            Login
          </Button>
        </Form>
        <div class="mt-4 text-center">
          <Link href="/signup">Don't have an account?</Link>
        </div>
      </div>
    </>
  )
})