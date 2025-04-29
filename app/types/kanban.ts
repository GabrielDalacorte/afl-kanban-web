export type Card = {
    id: number
    column: number
    delivery_date: string
    status: string
    assignee: number
    assignee_email: string
    created_at: string
}

export type Column = {
    id: number
    board: number
    name: string
    order: number
    cards: Card[]
}

export type KanbanBoardProps = {
    boardId: number
}
  