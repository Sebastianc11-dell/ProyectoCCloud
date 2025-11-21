"use client"

import { X } from "lucide-react"

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-md w-full border border-surface-light">
        <div className="flex items-center justify-between p-6 border-b border-surface-light">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
