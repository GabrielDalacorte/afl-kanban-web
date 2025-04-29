export type Board = {
    id: number
    name: string
    description: string
    created_at: string
    owner: number
    owner_email: string
    active: boolean
    columns: Array<{
      id: number
      board: number
      name: string
      order: number
      cards: Array<{
        id: number
        column: number
        delivery_date: string
        status: string
        assignee: number
        assignee_email: string
        created_at: string
      }>
    }>
  }