"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Phone, Save, LogOut, Bell, Lock, Eye, EyeOff } from "lucide-react"

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [activeTab, setActiveTab] = useState("profile")
  const [savedMessage, setSavedMessage] = useState("")
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    priceDropAlerts: true,
    weeklyReport: true,
    marketingEmails: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePreferenceChange = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  const handleSaveProfile = () => {
    // TODO: Call API to save profile
    setSavedMessage("Perfil actualizado correctamente")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Las contrasenas no coinciden")
      return
    }
    // TODO: Call API to change password
    setSavedMessage("Contrasena actualizada correctamente")
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }))
  }, [user])

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Configuracion de cuenta</h1>
            <p className="text-foreground-muted">Administra tu perfil y preferencias</p>
          </div>

          {/* Success Message */}
          {savedMessage && (
            <div className="mb-6 p-4 rounded-lg bg-success bg-opacity-10 border border-success text-success text-sm">
              {savedMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-surface-light overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <User className="inline mr-2" size={18} />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "security"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <Lock className="inline mr-2" size={18} />
              Seguridad
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "notifications"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <Bell className="inline mr-2" size={18} />
              Notificaciones
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="card-base">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                    <User size={48} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Foto de perfil</h3>
                    <p className="text-foreground-muted text-sm mb-4">Sube una nueva imagen</p>
                    <button className="btn-secondary">Subir foto</button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card-base">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Informacion personal
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Correo electronico</label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-3 text-foreground-muted" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="input-base pl-10 opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">El correo no puede modificarse</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Numero telefonico</label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-3 top-3 text-foreground-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-base pl-10"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                  >
                    <Save size={20} />
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="card-base">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-primary" />
                  Cambiar contrasena
                </h3>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contrasena actual</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            current: !showPassword.current,
                          })
                        }
                        className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                      >
                        {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nueva contrasena</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            new: !showPassword.new,
                          })
                        }
                        className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                      >
                        {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirmar contrasena</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirm: !showPassword.confirm,
                          })
                        }
                        className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                      >
                        {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Change Password Button */}
                  <button
                    onClick={handleChangePassword}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                  >
                    <Lock size={20} />
                    Actualizar contrasena
                  </button>
                </div>
              </div>

              {/* Account Danger Zone */}
              <div className="card-base border border-danger border-opacity-30 bg-danger bg-opacity-5">
                <h3 className="text-lg font-bold text-danger mb-4">Zona de riesgo</h3>
                <p className="text-foreground-muted text-sm mb-4">
                  Cierra sesion en todos los dispositivos o elimina tu cuenta permanentemente.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleLogout} className="flex-1 btn-primary flex items-center justify-center gap-2">
                    <LogOut size={20} />
                    Cerrar sesion
                  </button>
                  <button className="flex-1 px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:bg-opacity-10 font-medium transition">
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="card-base">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  Preferencias de notificacion
                </h3>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light">
                    <div>
                      <p className="font-medium text-foreground mb-1">Notificaciones por correo</p>
                      <p className="text-sm text-foreground-muted">Recibe actualizaciones de tus productos monitoreados</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={() => handlePreferenceChange("emailNotifications")}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>

                  {/* Price Drop Alerts */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light">
                    <div>
                      <p className="font-medium text-foreground mb-1">Alertas de precio</p>
                      <p className="text-sm text-foreground-muted">Seras avisado cuando baje el precio del producto</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.priceDropAlerts}
                        onChange={() => handlePreferenceChange("priceDropAlerts")}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>

                  {/* Weekly Report */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light">
                    <div>
                      <p className="font-medium text-foreground mb-1">Reporte semanal</p>
                      <p className="text-sm text-foreground-muted">Recibe un resumen semanal del monitoreo</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.weeklyReport}
                        onChange={() => handlePreferenceChange("weeklyReport")}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light">
                    <div>
                      <p className="font-medium text-foreground mb-1">Correos promocionales</p>
                      <p className="text-sm text-foreground-muted">Enterate de novedades y anuncios especiales</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketingEmails}
                        onChange={() => handlePreferenceChange("marketingEmails")}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>

                  {/* Save Preferences Button */}
                  <button
                    onClick={() => {
                      setSavedMessage("Preferencias de notificacion guardadas")
                      setTimeout(() => setSavedMessage(""), 3000)
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                  >
                    <Save size={20} />
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
