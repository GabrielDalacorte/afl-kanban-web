"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isConfirmLoading?: boolean
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  isConfirmLoading = false,
}: CustomModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
              disabled={isConfirmLoading}
            >
              {cancelText}
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70"
              onClick={onConfirm}
              disabled={isConfirmLoading}
            >
              {isConfirmLoading ? "Excluindo..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
