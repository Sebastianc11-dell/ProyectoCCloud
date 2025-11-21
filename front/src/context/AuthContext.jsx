"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"

const STORAGE_KEY = "auth"
const AuthContext = createContext()

const persistSession = (payload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  api.setToken(payload.token)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        api.setToken(parsed.token)
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const { data } = await api.post("/api/auth/login", { email, password })
      setUser(data.user)
      persistSession(data)
      return true
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password"
      setError(message)
      return false
    }
  }

  const register = async ({ name, email, password, phone }) => {
    try {
      setError(null)
      const { data } = await api.post("/api/auth/register", { name, email, password, phone })
      setUser(data.user)
      persistSession(data)
      return true
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed"
      setError(message)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    api.setToken(null)
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
