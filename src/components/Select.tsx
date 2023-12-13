import {
  type Signal,
  component$,
  type QRL,
  useSignal,
  useTask$,
  $,
} from "@builder.io/qwik"

interface SelectProps {
  label?: string
  error?: boolean
  props?: any
  bind?: Signal
  onChange?: QRL
  options: { label: string; value: string }[]
  placeholder?: string
  value?: string | string[] | null | undefined
}

export const Select = component$<SelectProps>(
  ({
    label,
    bind,
    onChange,
    options,
    placeholder,
    value,
    // error = false,
    ...props
  }) => {
    const binderSignal = useSignal()
    const values = useSignal<string[]>()
    useTask$(({ track }) => {
      track(() => value)
      values.value = Array.isArray(value)
        ? value
        : value && typeof value === "string"
        ? [value]
        : []
    })
    const binder = bind != null ? bind : binderSignal
    // TODO: Add CVA for error handling
    return (
      <div class="form-control">
        <label class="label">
          <span class="label-text">{label}</span>
        </label>
        <select
          bind:value={binder}
          onChange$={$(() => (onChange ? onChange() : null))}
          class="select select-primary w-full max-w-xs"
          {...props}
        >
          <option value="" disabled hidden selected={!value}>
            {placeholder}
          </option>
          {options.map(({ label, value }) => (
            <option
              key={`${value}-${Math.random()}`}
              value={value}
              selected={values.value?.includes(value)}
            >
              {label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)
