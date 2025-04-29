"use client";

import { KanbanBoard } from "@/app/_components/kanban/page";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const boardId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const boardName = searchParams.get("name");

  if (!boardId) {
    return <div>Quadro não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 mr-3">
            <ArrowLeft size={18} />
          </Link>
            <h1 className="text-lg font-medium">Quadro {boardName}</h1>
        </div>
        <KanbanBoard boardId={boardId} />
      </div>
    </div>
  );
}