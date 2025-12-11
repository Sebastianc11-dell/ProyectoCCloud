"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Modal from "../components/Modal"
import { Trash2, Eye, Settings, TrendingDown, TrendingUp } from "lucide-react"
import { api } from "../services/api"

const formatCurrency = (value, currency = "USD") => {
  if (value == null) return "--"
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
  } catch {
    return `$${value}`
  }
}

const formatDate = (value) => {
  if (!value) return "Sin registro"
  try {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

const PriceBadge = ({ current, target }) => {
  if (current == null || target == null) {
    return <span className="px-2 py-1 rounded bg-surface text-foreground-muted text-xs">Sin datos</span>
  }
  const diff = ((current - target) / target) * 100
  const isDown = diff <= 0
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
        isDown ? "bg-status-down/20 text-status-down" : "bg-status-up/20 text-status-up"
      }`}
    >
      {isDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
      {diff > 0 ? "+" : ""}
      {diff.toFixed(1)}%
    </span>
  )
}

const getDomain = (link) => {
  if (!link) return ""
  try {
    return new URL(link).hostname.replace(/^www\./, "")
  } catch {
    return link
  }
}

export default function Tracking() {
  const [trackedProducts, setTrackedProducts] = useState([])
  const [viewMode, setViewMode] = useState("cards")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTracked = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get("/api/tracking")
      setTrackedProducts(
        (data || []).map((item) => ({
          id: item.id,
          title: item.title || item.product?.title,
          currentPrice: item.price ?? item.product?.price ?? null,
          targetPrice: item.targetPrice,
          currency: item.currency || item.product?.currency || "USD",
          image: item.image || item.thumbnail || item.product?.thumbnail,
          permalink: item.permalink || item.product?.permalink,
          lastUpdate: item.updatedAt || item.updated_at,
          belowTarget:
            item.targetPrice != null &&
            (item.price ?? item.product?.price ?? Infinity) <= Number(item.targetPrice || Infinity),
        })),
      )
    } catch (err) {
      setError("No pudimos cargar tus productos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracked()
  }, [])

  const savings = useMemo(
    () =>
      trackedProducts.reduce((sum, item) => {
        if (item.currentPrice == null || item.targetPrice == null) return sum
        return sum + Math.max(0, item.targetPrice - item.currentPrice)
      }, 0),
    [trackedProducts],
  )

  const handleViewHistory = (product) => {
    setSelectedProduct(product)
    setModalType("history")
    setIsModalOpen(true)
  }

  const handleConfigureAlerts = (product) => {
    setSelectedProduct(product)
    setModalType("alerts")
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product)
    setModalType("delete")
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return
    try {
      await api.delete(`/api/tracking/${selectedProduct.id}`)
      setTrackedProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
    } catch (err) {
      setError("No pudimos eliminar el seguimiento")
    } finally {
      setIsModalOpen(false)
      setSelectedProduct(null)
    }
  }

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Mis seguimientos</h1>
              <p className="text-foreground-muted">
                {trackedProducts.length} producto{trackedProducts.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "cards" ? "bg-primary text-white" : "btn-secondary"
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "table" ? "bg-primary text-white" : "btn-secondary"
                }`}
              >
                Tabla
              </button>
            </div>
          </div>

          {trackedProducts.length > 0 && (
            <div className="card-base mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Ahorro potencial</p>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(savings)}</p>
                </div>
                <p className="text-sm text-foreground-muted">
                  Actualiza tus productos para mantener los precios en tiempo real.
                </p>
              </div>
            </div>
          )}

          {loading && <p className="text-foreground-muted mb-4">Cargando tus productos...</p>}
          {error && <p className="text-danger mb-4">{error}</p>}

          {trackedProducts.length > 0 ? (
            viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trackedProducts.map((product) => (
                  <TrackingCard
                    key={product.id}
                    product={product}
                    onViewHistory={handleViewHistory}
                    onConfigureAlerts={handleConfigureAlerts}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="card-base overflow-x-auto">
                <TrackingTable
                  products={trackedProducts}
                  onViewHistory={handleViewHistory}
                  onConfigureAlerts={handleConfigureAlerts}
                  onDelete={handleDeleteProduct}
                />
              </div>
            )
          ) : (
            <div className="card-base text-center py-12">
              <p className="text-foreground mb-4">Aun no sigues ningun producto</p>
              <a href="/products" className="btn-primary">
                Buscar productos
              </a>
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <>
          {modalType === "history" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Historial de precios">
              <HistoryModal product={selectedProduct} />
            </Modal>
          )}
          {modalType === "alerts" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configurar alertas">
              <AlertsModal product={selectedProduct} />
            </Modal>
          )}
          {modalType === "delete" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quitar seguimiento">
              <div className="space-y-4">
                <p className="text-foreground">
                  Deseas dejar de monitorear <strong>{selectedProduct.title}</strong>?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Cancelar
                  </button>
                  <button onClick={confirmDelete} className="btn-primary flex-1">
                    Eliminar
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}

      <Footer />
    </div>
  )
}

function TrackingCard({ product, onViewHistory, onConfigureAlerts, onDelete }) {
  const domain = getDomain(product.permalink)
  return (
    <div className="card-base flex flex-col gap-4">
      <div className="relative rounded-xl bg-surface-light overflow-hidden h-44">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-contain bg-surface-light"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <div className="absolute top-3 right-3 bg-surface bg-opacity-95 rounded-lg px-3 py-1 text-xs text-foreground-muted">
          {product.currency}
        </div>
        {product.belowTarget && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded bg-success/20 text-success text-xs font-semibold">
            Bajo objetivo
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
        {product.permalink && (
          <a href={product.permalink} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
            {domain}
          </a>
        )}
      </div>

      <div className="p-3 rounded-lg bg-surface-light space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-muted">Cambio</span>
          <PriceBadge current={product.currentPrice} target={product.targetPrice} />
        </div>
        <div className="flex justify-between text-xs text-foreground-muted">
          <div>
            <p>Objetivo</p>
            <p className="font-semibold">{formatCurrency(product.targetPrice, product.currency)}</p>
          </div>
          <div>
            <p>Actual</p>
            <p className="font-semibold">{formatCurrency(product.currentPrice, product.currency)}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-foreground-muted">
        <p>Ultima actualizacion: {formatDate(product.lastUpdate)}</p>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onViewHistory(product)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <Eye size={16} />
          Historial
        </button>
        <button
          onClick={() => onConfigureAlerts(product)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <Settings size={16} />
          Alertas
        </button>
        <button
          onClick={() => onDelete(product)}
          className="btn-secondary flex items-center justify-center gap-2 text-danger hover:bg-danger/10"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

function TrackingTable({ products, onViewHistory, onConfigureAlerts, onDelete }) {
  return (
    <table className="w-full">
      <thead className="border-b border-surface-light">
        <tr>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Producto</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Precio actual</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Objetivo</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Ultima actualizacion</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b border-surface-light hover:bg-surface-light transition">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-surface-light overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground line-clamp-1">{product.title}</p>
                  {product.permalink && (
                    <a
                      href={product.permalink}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver producto
                    </a>
                  )}
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <p className="text-lg font-bold text-primary">{formatCurrency(product.currentPrice, product.currency)}</p>
            </td>
            <td className="py-4 px-4">{formatCurrency(product.targetPrice, product.currency)}</td>
            <td className="py-4 px-4 text-foreground">{formatDate(product.lastUpdate)}</td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button onClick={() => onViewHistory(product)} className="p-2 hover:bg-surface-light rounded transition" title="Historial">
                  <Eye size={18} className="text-primary" />
                </button>
                <button onClick={() => onConfigureAlerts(product)} className="p-2 hover:bg-surface-light rounded transition" title="Alertas">
                  <Settings size={18} className="text-primary" />
                </button>
                <button onClick={() => onDelete(product)} className="p-2 hover:bg-surface-light rounded transition" title="Eliminar">
                  <Trash2 size={18} className="text-danger" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HistoryModal({ product }) {
  return (
    <div className="space-y-3">
      <p className="text-foreground-muted text-sm">Proximamente: grafico con historial real.</p>
      <p className="text-foreground">Ultima actualizacion: {formatDate(product.lastUpdate)}</p>
      <p className="text-foreground">Precio actual: {formatCurrency(product.currentPrice, product.currency)}</p>
    </div>
  )
}

function AlertsModal({ product }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground-muted">
        Configura alertas desde la seccion Alertas. Proximamente podras hacerlo desde aqui directamente.
      </p>
      <button className="btn-primary w-full" onClick={() => (window.location.href = "/alerts")}>
        Ir a Alertas
      </button>
    </div>
  )
}
