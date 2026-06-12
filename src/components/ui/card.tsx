import { type HTMLAttributes, type ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  children: ReactNode
}

export function Card({ hover, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
