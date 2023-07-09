import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {

  return (
    <>
      <h1>Folding Habits</h1>
      <p>Welcome to my little side project. I'm building this to assist me in my language learning journey. If you're following the refold method, perhaps you might find this useful as well</p>
    </>
  )
});

export const head: DocumentHead = {
  title: "Folding habits",
  meta: [
    {
      name: "Folding Habits",
      content: "An unofficial refold habit tracker",
    },
  ],
};
