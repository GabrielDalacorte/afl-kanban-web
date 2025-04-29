import { PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import { BoardList } from "../board"

export function Home() {
 
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bem-vindo de volta ao seu painel de controle</p>
        </div>
        <Button className="bg-[#C1CE4B] hover:bg-[#C1CE4B]">
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar novo quadro
        </Button>
      </div>
      <div>
        <BoardList />
      </div>
    </div>
  )
}

export default Home
