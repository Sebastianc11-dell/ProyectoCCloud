"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Modal from "../components/Modal"
import { Plus, Trash2, Bell } from "lucide-react"
import { api } from "../services/api"

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [trackedOptions, setTrackedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    trackedProductId: "",
    threshold: "",
    channel: "sms",
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [alertsRes, trackedRes] = await Promise.all([api.get("/api/alerts"), api.get("/api/tracking")])
      setAlerts(alertsRes.data || [])
      setTrackedOptions(
        (trackedRes.data || []).map((item) => ({
          id: item.id,
          title: item.title || item.product?.title,
          price: item.price ?? item.product?.price,
        })),
      )
    } catch (err) {
      setError("No pudimos cargar tus alertas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/alerts/${id}`)
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError("No pudimos eliminar la alerta")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.trackedProductId || !form.threshold) return
    try {
      await api.post("/api/alerts", {
        trackedProductId: form.trackedProductId,
        channel: form.channel,
        threshold: Number(form.threshold),
      })
      setIsModalOpen(false)
      setForm({ trackedProductId: "", threshold: "", channel: "sms" })
      fetchData()
    } catch {
      setError("No pudimos crear la alerta")
    }
  }

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Alertas</h1>
              <p className="text-foreground-muted">Crea alertas y recibe SMS cuando los precios bajen</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
              disabled={trackedOptions.length === 0}
            >
              <Plus size={20} />
              Nueva alerta
            </button>
          </div>

          {error && <p className="text-danger mb-4">{error}</p>}
          {loading && <p className="text-foreground-muted mb-4">Cargando...</p>}

          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="card-base flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      {alert.product?.title || alert.trackedProduct?.product?.title || "Producto"}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      Umbral: ${alert.threshold} · Canal: {alert.channel.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 hover:bg-surface-light rounded transition text-danger"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-base text-center py-12">
              <Bell size={40} className="mx-auto text-foreground-muted mb-4 opacity-50" />
              <p className="text-foreground mb-4">No tienes alertas activas</p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary" disabled={trackedOptions.length === 0}>
                Crear alerta
              </button>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear alerta">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Producto</label>
            <select
              className="input-base"
              value={form.trackedProductId}
              onChange={(e) => setForm({ ...form, trackedProductId: e.target.value })}
              required
            >
              <option value="">Selecciona un producto</option>
              {trackedOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title} {opt.price != null ? `(${opt.price})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Precio objetivo</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.threshold}
              onChange={(e) => setForm({ ...form, threshold: e.target.value })}
              className="input-base"
              placeholder="Ej. 499.99"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Canal</label>
            <select
              className="input-base"
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
            >
              <option value="sms">SMS</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  )
}
