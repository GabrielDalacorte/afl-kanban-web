"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Badge } from "@/app/_components/ui/badge"
import Link from "next/link"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import type { Board } from "@/app/types/board"
import { CustomModal } from "@/app/_components/modal/custom-modal"

interface BoardListProps {
  initialBoards?: Board[]
  onBoardsChange?: (boards: Board[]) => void
}

export function BoardList({ initialBoards, onBoardsChange }: BoardListProps) {
  const [boards, setBoards] = useState<Board[]>(initialBoards || [])
  const [loading, setLoading] = useState(!initialBoards || initialBoards.length === 0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null)

  useEffect(() => {
    if (initialBoards && initialBoards.length > 0) {
      setBoards(initialBoards)
      return
    }

    async function fetchBoards() {
      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.boardsAPI}`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          const data = await response.json()
          setBoards(data)
          if (onBoardsChange) onBoardsChange(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchBoards()
  }, [initialBoards, onBoardsChange])

  const handleDeleteClick = (board: Board) => {
    setBoardToDelete(board)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!boardToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.boardsAPI}${boardToDelete.id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const updatedBoards = boards.map((b) =>
          b.id === boardToDelete.id ? { ...b, active: false } : b
        )
        setBoards(updatedBoards)
        if (onBoardsChange) onBoardsChange(updatedBoards)
        setIsModalOpen(false)
      } else {
        console.error("Erro ao inativar quadro")
      }
    } catch (error) {
      console.error("Erro ao inativar quadro:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setBoardToDelete(null)
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 p-4 border-b border-[#e5e7eb]">
          <div className="font-medium">Nome do quadro</div>
          <div className="font-medium">Responsável</div>
          <div className="font-medium">Status</div>
        </div>
        <div>
          {boards.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum quadro encontrado. Crie um novo quadro para começar.
            </div>
          ) : (
            boards.map((board) => (
              <div key={board.id} className="grid grid-cols-3 p-4 border-b border-[#e5e7eb] items-center">
                <div>{board.name}</div>
                <div>{board.owner_email}</div>
                <div className="flex items-center justify-between">
                  {board.active ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
                  )}
                  <div className="flex space-x-2">
                    {board.active ? (
                      <Link
                        href={`/board/${board.id}?name=${encodeURIComponent(board.name)}`}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye size={18} />
                      </Link>
                    ) : (
                      <span className="text-gray-300 cursor-not-allowed">
                        <Eye size={18} />
                      </span>
                    )}
                    <button
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteClick(board)}
                      disabled={!board.active}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {boardToDelete && (
        <CustomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Confirmar inativação"
          description={`Tem certeza que deseja inativar o quadro "${boardToDelete.name}"?.`}
          confirmText="Inativar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          isConfirmLoading={isDeleting}
        />
      )}
    </>
  )
}

export default BoardList