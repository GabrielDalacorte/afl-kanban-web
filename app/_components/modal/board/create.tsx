"use client"

import type React from "react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import type { Board } from "@/app/types/board"
import { toast } from "react-toastify"

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onBoardCreated: (board: Board) => void
}

export function CreateBoardModal({ isOpen, onClose, onBoardCreated }: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!boardName.trim()) {
      setError("O nome do quadro é obrigatório")
      return
    }

    setIsCreating(true)
    setError("")

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.boardsAPI}`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: boardName.trim(),
        }),
      })

      if (response.ok) {
        const newBoard = await response.json()
        onBoardCreated(newBoard)
        setBoardName("")
        onClose()
        toast.success("Quadro criado com sucesso!")
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || "Erro ao criar quadro. Por favor, tente novamente.")
        toast.error(errorData.message || "Erro ao criar quadro. Por favor, tente novamente.")
      }
    } catch (err) {
      setError("Erro ao criar quadro. Por favor, tente novamente.")
      toast.error("Erro ao criar quadro. Por favor, tente novamente.")
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Criar novo quadro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do quadro
              </label>
              <input
                type="text"
                id="boardName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1CE4B] focus:border-transparent"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Digite o nome do quadro"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C1CE4B] text-white rounded-md hover:bg-[#b1bd45] transition-colors disabled:opacity-70"
                disabled={isCreating}
              >
                {isCreating ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}