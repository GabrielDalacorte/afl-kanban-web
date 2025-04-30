"use client"

import { useEffect, useState } from "react"
import { Calendar, Plus, Edit2, Trash2, GripVertical } from "lucide-react"
import { Badge } from "@/app/_components/ui/badge"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { configBackendConnection, endpoints, getAuthHeaders } from "@/app/services/api"
import type { Column, KanbanBoardProps, Card } from "@/app/types/kanban"
import { getImage } from "@/app/services/storage"
import { toast } from "react-toastify"
import { CardFormModal } from "@/app/_components/kanban/modal/create-edit"
import { DeleteConfirmModal } from "@/app/_components/kanban/modal/delete"

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState("/person.png")
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchColumnsAndCards = async () => {
    setLoading(true)
    try {
      const columnsRes = await fetch(`${configBackendConnection.baseURL}/${endpoints.columnsAPI}?board=${boardId}`, {
        headers: getAuthHeaders(),
      })
      const columnsData: Column[] = await columnsRes.json()

      columnsData.sort((a, b) => a.order - b.order)

      columnsData.forEach((column) => {
        column.cards.sort((a, b) => a.order - b.order)
      })

      setColumns(columnsData)
    } catch (error) {
      toast.error("Erro ao carregar quadros")
      console.error("Erro ao carregar quadros:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (boardId) fetchColumnsAndCards()
  }, [boardId])

  useEffect(() => {
    const userImage = getImage()
    if (userImage) {
      setAvatarUrl(`${configBackendConnection.baseURL}${userImage}`)
    }
  }, [])

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId, type } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    if (type === "column") {
      const newColumns = Array.from(columns)
      const [movedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movedColumn)

      let newOrder = 1

      if (destination.index === 0) {
        const nextColumn = newColumns[1]
        newOrder = nextColumn ? Math.max(1, nextColumn.order - 1) : 1
      } else if (destination.index === newColumns.length - 1) {
        const prevColumn = newColumns[destination.index - 1]
        newOrder = prevColumn ? prevColumn.order + 1 : 1
      } else {
        const prevColumn = newColumns[destination.index - 1]
        const nextColumn = newColumns[destination.index + 1]
        newOrder = Math.floor((prevColumn.order + nextColumn.order) / 2)

        if (newOrder === prevColumn.order || newOrder === nextColumn.order) {
          newColumns.forEach((column, idx) => {
            column.order = idx + 1
          })
          newOrder = destination.index + 1
        }
      }

      movedColumn.order = newOrder

      setColumns(newColumns)

      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.columnsAPI}${movedColumn.id}/`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ order: newOrder }),
        })

        if (!response.ok) {
          const data = await response.json()
          toast.error(data.detail || "Erro ao mover coluna")
          fetchColumnsAndCards()
          return
        }

        if (
          destination.index > 0 &&
          destination.index < newColumns.length - 1 &&
          newOrder === newColumns[destination.index - 1].order
        ) {
          const updateOrderPromises = newColumns
            .filter((column) => column.id !== movedColumn.id)
            .map((column) =>
              fetch(`${configBackendConnection.baseURL}/${endpoints.columnsAPI}${column.id}/`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ order: column.order }),
              }),
            )

          await Promise.all(updateOrderPromises)
        }

        toast.info("Coluna movida")
      } catch (e) {
        toast.error("Erro ao mover coluna")
        fetchColumnsAndCards()
      }

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

    let newOrder = 1

    if (destination.index === 0) {
      const nextCard = destCards[1]
      newOrder = nextCard ? Math.max(1, nextCard.order - 1) : 1
    } else if (destination.index === destCards.length - 1) {
      const prevCard = destCards[destination.index - 1]
      newOrder = prevCard ? prevCard.order + 1 : 1
    } else {
      const prevCard = destCards[destination.index - 1]
      const nextCard = destCards[destination.index + 1]
      newOrder = Math.floor((prevCard.order + nextCard.order) / 2)

      if (newOrder === prevCard.order || newOrder === nextCard.order) {
        destCards.forEach((card, idx) => {
          card.order = idx + 1
        })
        newOrder = destination.index + 1
      }
    }

    movedCard.order = newOrder

    const payload: any = {
      column: newColumns[destColIdx].id,
      order: newOrder,
    }

    if (statusChanged) {
      payload.status = "done"
    }

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.cardsAPI}${movedCard.id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.detail || "Erro ao mover card")
        return
      }

      await fetchColumnsAndCards()

      if (statusChanged) {
        toast.info("Status atualizado")
      } else {
        toast.info("Card movido")
      }
    } catch (e) {
      toast.error("Erro ao mover card")
    }
  }

  const handleAddCard = (columnId: number) => {
    setActiveColumnId(columnId)
    setEditingCard(null)
    setIsCardModalOpen(true)
  }

  const handleEditCard = (card: Card) => {
    setEditingCard(card)
    setActiveColumnId(card.column)
    setIsCardModalOpen(true)
  }

  const handleDeleteClick = (card: Card) => {
    setCardToDelete(card)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.cardsAPI}${cardToDelete.id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        toast.success("Card excluído com sucesso")

        const updatedColumns = columns.map((column) => {
          if (column.id === cardToDelete.column) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardToDelete.id),
            }
          }
          return column
        })

        setColumns(updatedColumns)
        setIsDeleteModalOpen(false)
        setCardToDelete(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.detail || "Erro ao excluir card")
      }
    } catch (error) {
      toast.error("Erro ao excluir card")
      console.error("Erro ao excluir card:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCardSaved = () => {
    fetchColumnsAndCards()
  }

  if (loading) return <div className="flex justify-center items-center h-64">Carregando...</div>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="columns" direction="horizontal" type="column">
        {(provided) => (
          <div className="overflow-x-auto pb-4" ref={provided.innerRef} {...provided.droppableProps}>
            <div className="flex min-w-max space-x-4">
              {columns.map((column, index) => (
                <Draggable key={column.id.toString()} draggableId={`column-${column.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical size={18} />
                          </div>
                          <h2 className="font-medium">{column.name}</h2>
                        </div>
                        <button
                          onClick={() => handleAddCard(column.id)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          title="Adicionar card"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <Droppable droppableId={column.id.toString()} type="card">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-4 min-h-[200px] max-h-[calc(100vh-200px)] overflow-y-auto ${
                              snapshot.isDraggingOver ? "bg-gray-200 rounded-md p-2 -mx-2" : ""
                            }`}
                          >
                            {column.cards.map((card, index) => (
                              <Draggable key={card.id.toString()} draggableId={card.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white rounded-lg p-4 shadow-sm border border-[#e5e7eb] relative group ${
                                      snapshot.isDragging ? "shadow-md opacity-90 rotate-1" : ""
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditCard(card)}
                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        title="Editar card"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteClick(card)}
                                        className="p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Excluir card"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
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
                                      <div className="font-medium">{card.title}</div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">Previsão de entrega</div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-sm">
                                        <Calendar size={14} className="mr-1" />
                                        {card.delivery_date}
                                      </div>
                                      <div>
                                        <Image
                                          src={avatarUrl || "/placeholder.svg"}
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
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {activeColumnId !== null && (
        <CardFormModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          columnId={activeColumnId}
          onCardSaved={handleCardSaved}
          editCard={editingCard}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setCardToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir card"
        description={`Tem certeza que deseja excluir o card "${cardToDelete?.title}"? Esta ação não pode ser desfeita.`}
        isDeleting={isDeleting}
      />
    </DragDropContext>
  )
}

export default KanbanBoard
