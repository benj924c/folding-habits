import { component$ } from "@builder.io/qwik";

export interface InputProps {
  placeholder?: string
  type?:
    |"button"
    |"checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"

  bind?: any
  label?: string
}

export const Input = component$<InputProps>((
  {
    type = "text",
    placeholder = "Type here",
    bind,
    label,
  }) => {
  return (
    <div class="form-control">
      {label && (
        <label class="label">
          <span class="label-text">{label}</span>
        </label>
      )}
      <input bind:value={bind} type={type} placeholder={placeholder} class="input input-bordered input-primary w-full max-w-xs" />
    </div>
  )
})