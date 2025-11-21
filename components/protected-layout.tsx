"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface ProtectedLayoutProps {
  children: ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push("/")
    }
  }, [user, requiredRole, router, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Car Rental System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.name}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logout()
              router.push("/login")
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  )
}
