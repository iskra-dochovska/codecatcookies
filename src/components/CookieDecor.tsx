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
      className={`rounded-3xl border-4 border-cookie-charcoal bg-white p-6 shadow-[6px_6px_0_var(--color-cookie-charcoal)] sm:p-8 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
