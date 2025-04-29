"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User, Home } from "lucide-react"
import { removeFromStorage, getToken } from "@/app/services/storage"
import { useEffect } from "react"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    const token = getToken()
    if (!token && !isLoginPage) {
      router.replace("/login")
    }
    if (token && isLoginPage) {
      router.replace("/")
    }
  }, [pathname, isLoginPage, router])

  const handleLogout = () => {
    removeFromStorage()
    router.push("/login")
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-14 bg-white flex flex-col items-center py-4">
        <Link href="/" className="mb-8">
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        <div className="flex-grow"></div>
      </div>
      <div className="flex-1">
        <header className="h-14 border-b bg-white flex items-center justify-end px-4 space-x-4">
          <div className="w-8 h-8 bg-[#C1CE4B] rounded-full flex items-center justify-center">
            <User size={20} />
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors flex items-center justify-center"
            title="Sair"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span className="sr-only">Sair</span>
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
