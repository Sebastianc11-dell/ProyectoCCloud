"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Mail, Lock, Phone, User } from "lucide-react"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const { register, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phone") {
      const digits = value.replace(/\D/g, "")
      const hasCountry = value.trim().startsWith("+") || digits.startsWith("51")
      const local = (hasCountry ? digits.replace(/^51/, "") : digits).slice(0, 9)
      const formatted = local ? (hasCountry ? `+51${local}` : local) : ""
      return setFormData({ ...formData, phone: formatted })
    }
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contrasenas no coinciden")
      return
    }
    const phoneDigits = formData.phone.replace(/\D/g, "")
    const localPhone = phoneDigits.startsWith("51") ? phoneDigits.slice(2) : phoneDigits
    if (!/^9\d{8}$/.test(localPhone)) {
      alert("El telefono debe iniciar con 9 y tener 9 digitos (puedes usar +51 o solo 9 digitos)")
      return
    }
    setLoading(true)
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    })
    setLoading(false)
    if (success) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="container-app bg-gradient-to-br from-background to-surface">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">PriceWatch</h1>
            <p className="text-foreground-muted">Comienza a monitorear precios hoy</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="card-base space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Crea tu cuenta</h2>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-danger bg-opacity-10 border border-danger text-danger text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base pl-10"
                  placeholder="Juan Perez"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo electronico</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-base pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Telefono (Peru)</label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-base pl-10"
                  placeholder="+51 936 936 067"
                  inputMode="tel"
                  maxLength={13}
                  title="Usa +51 o solo 9 digitos empezando en 9"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contrasena</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-base pl-10"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirma tu contrasena</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-base pl-10"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* Login Link */}
            <p className="text-center text-foreground-muted">
              Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:text-primary-dark transition font-medium">
                Inicia sesion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
