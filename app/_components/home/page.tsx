"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import { BoardList } from "../board"
import { CreateBoardModal } from "@/app/_components/board/modal/create"
import type { Board } from "@/app/types/board"

export function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [boards, setBoards] = useState<Board[]>([])

  const handleBoardCreated = (newBoard: Board) => {
    setBoards((prevBoards) => [...prevBoards, newBoard])
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bem-vindo de volta ao seu painel de controle</p>
        </div>
        <Button className="bg-[#C1CE4B] hover:bg-[#b1bd45] text-white" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar novo quadro
        </Button>
      </div>
      <div>
        <BoardList onBoardsChange={setBoards} initialBoards={boards} />
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBoardCreated={handleBoardCreated}
      />
    </div>
  )
}

export default Home
