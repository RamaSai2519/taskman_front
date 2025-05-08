"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  getToken: () => string | null
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  getToken: () => null,
})

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      // In a real app, you would validate the token and get user info
      // For demo purposes, we'll just set a mock user
      setUser({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      })
    }
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    // In a real app, you would decode the token and set user info
    setUser({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const getToken = () => {
    return localStorage.getItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
