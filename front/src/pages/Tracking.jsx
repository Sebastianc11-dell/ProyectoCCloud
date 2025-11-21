"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Modal from "../components/Modal"
import { Trash2, Eye, Settings, TrendingDown, TrendingUp } from "lucide-react"
import { api } from "../services/api"

export default function Tracking() {
  const [trackedProducts, setTrackedProducts] = useState([])
  const [viewMode, setViewMode] = useState("cards") // 'cards' or 'table'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("") // 'history', 'alerts', 'delete'
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
          addedPrice: item.targetPrice,
          image: item.thumbnail || item.product?.thumbnail,
          change: null, // sin cálculo de variación
          seller: item.permalink || item.product?.permalink,
          lastUpdate: item.updatedAt || item.updated_at,
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
      setTrackedProducts(trackedProducts.filter((p) => p.id !== selectedProduct.id))
    } catch (err) {
      setError("No pudimos eliminar el tracking")
    } finally {
      setIsModalOpen(false)
      setSelectedProduct(null)
    }
  }

  const getTotalSavings = () => {
    return trackedProducts.reduce((sum, p) => {
      if (p.currentPrice == null || p.addedPrice == null) return sum
      return sum + Math.max(0, p.addedPrice - p.currentPrice)
    }, 0)
  }

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Tracking</h1>
              <p className="text-foreground-muted">Monitor {trackedProducts.length} products</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "cards" ? "bg-primary text-white" : "btn-secondary"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "table" ? "bg-primary text-white" : "btn-secondary"
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Savings Summary */}
          {trackedProducts.length > 0 && (
            <div className="card-base mb-8 bg-gradient-to-r from-surface to-surface-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Total Savings</p>
                  <p className="text-4xl font-bold text-success">${getTotalSavings().toFixed(2)}</p>
                </div>
                <div className="text-6xl opacity-20">💰</div>
              </div>
            </div>
          )}

          {/* Products View */}
          {trackedProducts.length > 0 ? (
            <>
              {viewMode === "cards" ? (
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
              )}
            </>
          ) : (
            <div className="card-base text-center py-12">
              <p className="text-4xl mb-4">📦</p>
              <p className="text-foreground mb-4">No products being tracked</p>
              <a href="/products" className="btn-primary">
                Search Products
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedProduct && (
        <>
          {modalType === "history" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Price History">
              <HistoryModal product={selectedProduct} />
            </Modal>
          )}

          {modalType === "alerts" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Alerts">
              <AlertsModal product={selectedProduct} />
            </Modal>
          )}

          {modalType === "delete" && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Remove from Tracking">
              <div className="space-y-4">
                <p className="text-foreground">
                  Are you sure you want to stop tracking <strong>{selectedProduct.title}</strong>?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn-primary flex-1">
                    Remove
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

// Tracking Card Component
function TrackingCard({ product, onViewHistory, onConfigureAlerts, onDelete }) {
  return (
    <div className="card-base flex flex-col">
      {/* Product Image and Price */}
      <div className="relative mb-4">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-40 rounded-lg object-cover"
        />
        <div className="absolute top-3 right-3 bg-surface bg-opacity-90 rounded-lg px-3 py-1">
          <p className="text-sm font-bold text-primary">${product.currentPrice}</p>
        </div>
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.title}</h3>
      <p className="text-sm text-foreground-muted mb-4">{product.seller}</p>

      {/* Price Change */}
      <div className="mb-4 p-3 rounded-lg bg-surface-light">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground-muted">Price Change</span>
          <span
            className={`text-lg font-bold flex items-center gap-1 ${
              product.change < 0 ? "status-down" : product.change > 0 ? "status-up" : "text-foreground-muted"
            }`}
          >
            {product.change < 0 ? <TrendingDown size={18} /> : product.change > 0 ? <TrendingUp size={18} /> : null}
            {product.change > 0 ? "+" : ""}
            {product.change}%
          </span>
        </div>
        <div className="text-xs text-foreground-muted">
          Was: ${product.addedPrice} • Now: ${product.currentPrice}
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-foreground-muted mb-4 space-y-1">
        <p>Tracked for {product.daysTracked} days</p>
        <p>Last update: {product.lastUpdate}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onViewHistory(product)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <Eye size={16} />
          History
        </button>
        <button
          onClick={() => onConfigureAlerts(product)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <Settings size={16} />
          Alerts
        </button>
        <button
          onClick={() => onDelete(product)}
          className="btn-secondary flex items-center justify-center gap-2 text-danger hover:bg-danger hover:bg-opacity-10"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

// Tracking Table Component
function TrackingTable({ products, onViewHistory, onConfigureAlerts, onDelete }) {
  return (
    <table className="w-full">
      <thead className="border-b border-surface-light">
        <tr>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Product</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Current Price</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Change</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Days Tracked</th>
          <th className="text-left py-4 px-4 text-foreground font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b border-surface-light hover:bg-surface-light transition">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-foreground line-clamp-1">{product.title}</p>
                  <p className="text-xs text-foreground-muted">{product.seller}</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <p className="text-lg font-bold text-primary">${product.currentPrice}</p>
            </td>
            <td className="py-4 px-4">
              <span
                className={`font-bold flex items-center gap-1 ${
                  product.change < 0 ? "status-down" : product.change > 0 ? "status-up" : "text-foreground-muted"
                }`}
              >
                {product.change < 0 ? <TrendingDown size={16} /> : product.change > 0 ? <TrendingUp size={16} /> : null}
                {product.change > 0 ? "+" : ""}
                {product.change}%
              </span>
            </td>
            <td className="py-4 px-4 text-foreground">{product.daysTracked} days</td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => onViewHistory(product)}
                  className="p-2 hover:bg-surface-light rounded transition"
                  title="View history"
                >
                  <Eye size={18} className="text-primary" />
                </button>
                <button
                  onClick={() => onConfigureAlerts(product)}
                  className="p-2 hover:bg-surface-light rounded transition"
                  title="Configure alerts"
                >
                  <Settings size={18} className="text-primary" />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="p-2 hover:bg-surface-light rounded transition"
                  title="Remove"
                >
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

// History Modal Component
function HistoryModal({ product }) {
  const priceHistory = [
    { date: "Today", price: product.currentPrice, change: 0 },
    { date: "Yesterday", price: product.currentPrice + 50, change: -2.3 },
    { date: "3 days ago", price: product.currentPrice + 100, change: -4.5 },
    { date: "Week ago", price: product.currentPrice + 150, change: -6.8 },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {priceHistory.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-light">
            <div>
              <p className="text-foreground font-medium">{entry.date}</p>
              <p className="text-sm text-foreground-muted">${entry.price}</p>
            </div>
            {entry.change < 0 && <span className="text-success font-medium">{entry.change}%</span>}
          </div>
        ))}
      </div>
      <a href={`/price-history/${product.id}`} className="btn-primary w-full block text-center">
        View Full Chart
      </a>
    </div>
  )
}

// Alerts Modal Component
function AlertsModal({ product }) {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "percentage", value: 10, enabled: true },
    { id: 2, type: "price", value: 1800, enabled: false },
  ])

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-light">
            <div>
              <p className="text-foreground font-medium">
                {alert.type === "percentage" ? `${alert.value}% price drop` : `Price below $${alert.value}`}
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alert.enabled}
                onChange={(e) => {
                  const updated = alerts.map((a) => (a.id === alert.id ? { ...a, enabled: e.target.checked } : a))
                  setAlerts(updated)
                }}
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        ))}
      </div>
      <button className="btn-primary w-full">Add New Alert</button>
    </div>
  )
}
