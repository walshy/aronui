import { type HTMLAttributes, type ReactNode } from 'react'

type Tone = 'teal' | 'gold' | 'navy'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  children: ReactNode
}

export function Chip({ tone, className = '', children, ...rest }: ChipProps) {
  return (
    <span
      className={['chip', tone ? `chip-${tone}` : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  )
}
