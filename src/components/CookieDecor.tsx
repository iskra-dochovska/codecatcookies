import type { CSSProperties, ReactNode } from 'react'

export function FramedSection({
  children,
  className,
  id,
  style,
}: {
  children: ReactNode
  className?: string
  id?: string
  style?: CSSProperties
}) {
  return (
    <div
      id={id}
      style={style}
      className={`rounded-3xl bg-cookie-honey p-6 sm:p-8 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
