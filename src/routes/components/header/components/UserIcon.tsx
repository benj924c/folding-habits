import { Slot, component$ } from "@builder.io/qwik"
import { Image } from "@unpic/qwik"

export const UserIcon = component$(() => {
  return (
    <>
      <div tabIndex={0} class="avatar self-center dropdown dropdown-hover dropdown-end cursor-pointer">
        <div class="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <Image width={40} height={40} layout="fullWidth" src="https://media.discordapp.net/stickers/867060573920559125.webp" />
        </div>
        <div tabIndex={0} class="h-28 dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
          <div class="flex flex-col h-full justify-end">
            <Slot />
          </div>
        </div>
      </div>
    </>
  )
})