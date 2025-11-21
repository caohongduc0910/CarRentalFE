"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Current user:", user)
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  if (user.role === "admin") {
    return router.push("/admin/dashboard")
  } else {
    return router.push("/user/dashboard")
  }
}
