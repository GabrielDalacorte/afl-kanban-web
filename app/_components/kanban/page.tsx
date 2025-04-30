"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import { Column, KanbanBoardProps } from "@/app/types/kanban"
import { getImage } from "@/app/services/storage"
import { toast } from "react-toastify"

async function updateCardColumn(cardId: number, newColumnId: number) {
  await fetch(`${configBackendConnection.baseURL}/${endpoints.cardsAPI}${cardId}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ column: newColumnId }),
  })
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState("/person.png")

  useEffect(() => {
    async function fetchColumnsAndCards() {
      setLoading(true)
      try {
        const columnsRes = await fetch(`${configBackendConnection.baseURL}/${endpoints.columnsAPI}?board=${boardId}`, {
          headers: getAuthHeaders(),
        })
        const columnsData: Column[] = await columnsRes.json()
        setColumns(columnsData)
      } finally {
        setLoading(false)
      }
    }
    if (boardId) fetchColumnsAndCards()
  }, [boardId])

  useEffect(() => {
    const userImage = getImage()
    if (userImage) {
      setAvatarUrl(`${configBackendConnection.baseURL}${userImage}`)
    }
  }, [])

  const onDragEnd = async (result: any) => {
    const { destination, source } = result
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }
  
    const sourceColIdx = columns.findIndex((col) => col.id.toString() === source.droppableId)
    const destColIdx = columns.findIndex((col) => col.id.toString() === destination.droppableId)
    if (sourceColIdx === -1 || destColIdx === -1) return
  
    const newColumns = [...columns]
    const sourceCards = Array.from(newColumns[sourceColIdx].cards)
    const [movedCard] = sourceCards.splice(source.index, 1)
    const destCards = Array.from(newColumns[destColIdx].cards)
  
    const destColumn = newColumns[destColIdx]
    let statusChanged = false
    if (destColumn.name.toLowerCase() === "producao" && movedCard.status !== "done") {
      movedCard.status = "done"
      statusChanged = true
    }
  
    destCards.splice(destination.index, 0, movedCard)
  
    try {
      const response = await fetch(
        `${configBackendConnection.baseURL}/${endpoints.cardsAPI}${movedCard.id}/`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ column: newColumns[destColIdx].id }),
        }
      )
  
      if (!response.ok) {
        const data = await response.json()
        toast.error(data.detail || "Erro ao mover card")
        return
      }
  
      newColumns[sourceColIdx] = {
        ...newColumns[sourceColIdx],
        cards: sourceCards,
      }
      newColumns[destColIdx] = {
        ...newColumns[destColIdx],
        cards: destCards,
      }
      setColumns(newColumns)
  
      if (statusChanged) {
        toast.info("Status atualizado")
      } else {
        toast.info("Card movido")
      }
    } catch (e) {
      toast.error("Erro ao mover card")
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max space-x-4">
          {columns.map((column) => (
            <Droppable droppableId={column.id.toString()} key={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 ${
                    snapshot.isDraggingOver ? "bg-gray-200" : ""
                  }`}
                >
                  <h2 className="font-medium mb-4">{column.name}</h2>
                  <div className="space-y-4 min-h-[200px] max-h-[calc(100vh-200px)] overflow-y-auto">
                    {column.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg p-4 shadow-sm border border-[#e5e7eb] ${
                              snapshot.isDragging ? "shadow-md opacity-90 rotate-1" : ""
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className="mb-2">
                              <Badge
                                className={
                                  card.status === "done"
                                    ? "bg-[#424A4D] text-white rounded-full px-3 py-1"
                                    : card.status === "late"
                                    ? "bg-[#F9BE34] text-black rounded-full px-3 py-1"
                                    : "bg-[#4A9800] text-white rounded-full px-3 py-1"
                                }
                              >
                                {card.status === "done"
                                  ? "Concluído"
                                  : card.status === "late"
                                  ? "Atrasado"
                                  : "No prazo"}
                              </Badge>
                            </div>
                            <div className="flex items-center mb-2">
                              <div className="font-medium">{card.assignee_email}</div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Previsão de entrega</div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                <Calendar size={14} className="mr-1" />
                                {card.delivery_date}
                              </div>
                              <div>
                                <Image
                                  src={avatarUrl}
                                  alt="Avatar"
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}

export default KanbanBoard