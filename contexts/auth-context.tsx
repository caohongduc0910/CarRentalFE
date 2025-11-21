"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  cccd: string
  address: string
  role: "admin" | "user"
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    console.log("AuthProvider loaded from localStorage:", { savedToken, savedUser })
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      throw new Error("Invalid credentials")
    }

    const data = await res.json()

    setToken(data.token)
    setUser(data.user)

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }


  const register = async (email: string, password: string, name: string) => {
    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
      throw new Error("Register failed")
    }

    const data = await res.json()

    setToken(data.token)
    setUser(data.user)

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }


  const logout = () => {
    console.log("Logging out user:", user)
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
