import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"

export default component$(() => {
  return (
    <div class="prose">
      <h1>Foldy App</h1>
      <p>
        Welcome to my little side project. I'm building this to assist me in my
        language learning journey. If you're following the refold method,
        perhaps you might find this useful as well.
      </p>
    </div>
  )
})

export const head: DocumentHead = {
  title: "Foldy App",
  meta: [
    {
      name: "Foldy App",
      content: "An unofficial refold companion app",
    },
  ],
}
