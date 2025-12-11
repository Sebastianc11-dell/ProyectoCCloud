"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu, X, LogOut, User } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-surface border-b border-surface-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold text-primary">
            PriceWatch
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-foreground-muted hover:text-foreground transition">
              Panel
            </Link>
            <Link to="/products" className="text-foreground-muted hover:text-foreground transition">
              Productos
            </Link>
            <Link to="/tracking" className="text-foreground-muted hover:text-foreground transition">
              Seguimiento
            </Link>
        
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <User size={18} className="text-primary" />
              <span className="text-foreground-muted text-sm">{user?.email}</span>
            </div>
            <Link to="/profile" className="hidden sm:block btn-secondary py-1">
              Perfil
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 btn-primary py-1">
              <LogOut size={18} />
              Salir
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-surface-light">
            <Link
              to="/dashboard"
              className="block py-2 text-foreground-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Panel
            </Link>
            <Link
              to="/products"
              className="block py-2 text-foreground-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Buscar productos
            </Link>
            <Link
              to="/tracking"
              className="block py-2 text-foreground-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Mi seguimiento
            </Link>
            <Link
              to="/alerts"
              className="block py-2 text-foreground-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Alertas
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
