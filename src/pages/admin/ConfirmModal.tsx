import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

function ConfirmModal({
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}: {
  message: ReactNode
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-cookie-charcoal/15 bg-white p-6">
        <p className="mb-5 text-sm text-cookie-charcoal">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-cookie-charcoal/30 px-4 py-1.5 text-xs font-bold text-cookie-charcoal/70 uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmModal
