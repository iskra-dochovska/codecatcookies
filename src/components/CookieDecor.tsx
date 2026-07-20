import type { ReactNode } from 'react'

export function FramedSection({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <div
      id={id}
      className={`rounded-3xl border-4 border-cookie-honey bg-white p-6 shadow-lg sm:p-8 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
