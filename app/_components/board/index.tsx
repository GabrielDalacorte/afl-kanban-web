"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Badge } from "@/app/_components/ui/badge"
import Link from "next/link"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import { Board } from "@/app/types/board"

export function BoardList() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await fetch(
          `${configBackendConnection.baseURL}/${endpoints.boardsAPI}`,
          {
            headers: getAuthHeaders(),
          }
        )
        if (response.ok) {
          const data = await response.json()
          setBoards(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchBoards()
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
      <div className="grid grid-cols-3 bg-gray-50 p-4 border-b border-[#e5e7eb]">
        <div className="font-medium">Nome do quadro</div>
        <div className="font-medium">Responsável</div>
        <div className="font-medium">Status</div>
      </div>
      <div>
        {boards.map((board) => (
          <div key={board.id} className="grid grid-cols-3 p-4 border-b border-[#e5e7eb] items-center">
            <div>{board.name}</div>
            <div>{board.owner_email}</div>
            <div className="flex items-center justify-between">
              {board.active ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Ativo
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  Inativo
                </Badge>
              )}
              <div className="flex space-x-2">
                <Link
                  href={`/board/${board.id}?name=${encodeURIComponent(board.name)}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Eye size={18} />
                </Link>
                <button className="text-gray-500 hover:text-gray-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardList