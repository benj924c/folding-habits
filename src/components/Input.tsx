import type { InputHTMLAttributes } from "@builder.io/qwik"
import { component$ } from "@builder.io/qwik"

export type InputProps = {
  label?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = component$<InputProps>(({ label, ...props }) => {
  // TODO: Add CVA for error handling
  return (
    <div class="form-control">
      {label && (
        <label class="label">
          <span class="label-text">{label}</span>
        </label>
      )}
      <input
        {...props}
        class="input input-bordered input-primary w-full max-w-xs"
      />
    </div>
  )
})
