"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import { toast } from "react-toastify"
import { Calendar } from "lucide-react"
import type { Card } from "@/app/types/kanban"

interface CardFormModalProps {
  isOpen: boolean
  onClose: () => void
  columnId: number
  onCardSaved: () => void
  editCard?: Card | null
}

export function CardFormModal({ isOpen, onClose, columnId, onCardSaved, editCard = null }: CardFormModalProps) {
  const [title, setTitle] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return ""

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr

    try {
      const date = new Date(dateStr)
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    } catch (e) {
      return dateStr
    }
  }

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ""

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/")
      return `${year}-${month}-${day}`
    }

    return dateStr
  }

  useEffect(() => {
    if (editCard) {
      setTitle(editCard.title)
      setDeliveryDate(formatDateForInput(editCard.delivery_date))
    } else {
      setTitle("")
      setDeliveryDate("")
    }
    setError("")
  }, [editCard, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    if (!deliveryDate) {
      setError("A data de entrega é obrigatória")
      return
    }

    setIsSaving(true)
    setError("")

    const formattedDate = formatDateForDisplay(deliveryDate)

    try {
      const url = editCard
        ? `${configBackendConnection.baseURL}/${endpoints.cardsAPI}${editCard.id}/`
        : `${configBackendConnection.baseURL}/${endpoints.cardsAPI}`

      const method = editCard ? "PATCH" : "POST"

      let order = 1
      if (!editCard) {
        try {
          const columnsRes = await fetch(
            `${configBackendConnection.baseURL}/${endpoints.columnsAPI}?board=${columnId}`,
            {
              headers: getAuthHeaders(),
            },
          )
          const columnsData = await columnsRes.json()
          const column = columnsData.find((col: any) => col.id === columnId)
          if (column && column.cards.length > 0) {
            const maxOrder = Math.max(...column.cards.map((card: Card) => card.order))
            order = maxOrder + 1
          }
        } catch (error) {
          console.error("Error getting max order:", error)
        }
      }

      const payload = editCard
        ? {
            title: title.trim(),
            delivery_date: formattedDate,
          }
        : {
            title: title.trim(),
            column: columnId,
            delivery_date: formattedDate,
            order: order,
          }

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editCard ? "Card atualizado com sucesso" : "Card criado com sucesso")
        onCardSaved()
        onClose()
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.detail || "Erro ao salvar card. Por favor, tente novamente.")
        toast.error(errorData.detail || "Erro ao salvar card")
      }
    } catch (err) {
      setError("Erro ao salvar card. Por favor, tente novamente.")
      toast.error("Erro ao salvar card")
      console.error("Erro ao salvar card:", err)
    } finally {
      setIsSaving(false)
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
          <h2 className="text-xl font-semibold mb-4">{editCard ? "Editar card" : "Novo card"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cardTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="cardTitle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A9800] focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do card"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Previsão de entrega
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <input
                  type="date"
                  id="deliveryDate"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A9800] focus:border-transparent"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4A9800] text-white rounded-md hover:bg-[#3e7e00] transition-colors disabled:opacity-70"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : editCard ? "Atualizar" : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}
