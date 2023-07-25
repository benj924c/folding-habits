import { component$ } from "@builder.io/qwik"
import { Image } from "@unpic/qwik"

export const Footer = component$(() => {
  return (
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded w-full justify-self-end">
      <div class="grid grid-flow-col gap-4">
        <a href="/use-of-icons" class="link link-hover">Use of Icons</a>
        <a href="/roadmap" class="link link-hover">Roadmap</a>
        <a href="https://refold.la/" target="_blank" class="link link-hover">Refold</a>
        <a href="/about" class="link link-hover">About</a>
      </div>
      <div>
        <a href="https://ko-fi.com/juicybenjamin" target="_blank">
          <Image width="223" height="30" src="https://ko-fi.com/img/githubbutton_sm.svg" />
        </a>
      </div>
      <div>
        <p class="text-center">
          Made with <span class="text-red-500">❤</span> by JuicyBenjamin
        </p>
      </div>
    </footer>
  )})