import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'teal' | 'navy' | 'gold' | 'ghost' | 'ghost-light'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'teal', size, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={['btn', `btn-${variant}`, size ? `btn-${size}` : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
