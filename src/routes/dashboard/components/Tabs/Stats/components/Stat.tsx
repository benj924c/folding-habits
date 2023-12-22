import type { JSXNode } from "@builder.io/qwik"
import { Slot, component$ } from "@builder.io/qwik"

export interface StatProps {
  title?: string
  value?: string
  desc?: string
  icon?: JSXNode
}

export default component$<StatProps>(({ title, value, desc, icon }) => {
  return (
    <div class="stat">
      {icon && <div class="stat-figure text-primary">{icon}</div>}
      {title && <div class="stat-title">{title}</div>}
      {value && <div class="stat-value text-primary">{value}</div>}
      <Slot />
      {desc && <div class="stat-desc">{desc}</div>}
    </div>
  )
})
