import { component$ } from "@builder.io/qwik"

export const Footer = component$(() => {
  return (
    <footer class="flex justify-center p-8 w-full justify-self-end">
      <p class="text-center">
        Made with <span class="text-red-500">❤</span> by JuicyBenjamin
      </p>
    </footer>
  )})