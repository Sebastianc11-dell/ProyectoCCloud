"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Modal from "../components/Modal"
import { Plus, Trash2, Bell } from "lucide-react"

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      productTitle: 'Apple MacBook Pro 14"',
      type: "percentage",
      value: 10,
      enabled: true,
      createdAt: "2024-01-15",
      lastTriggered: "2024-01-18",
    },
    {
      id: 2,
      productTitle: "Sony WH-1000XM5 Headphones",
      type: "price",
      value: 300,
      enabled: true,
      lastTriggered: null,
    },
    {
      id: 3,
      productTitle: 'Samsung 4K Smart TV 55"',
      type: "percentage",
      value: 15,
      enabled: false,
      createdAt: "2024-01-20",
      lastTriggered: null,
    },
  ])

  const [sentAlerts, setSentAlerts] = useState([
    {
      id: 1,
      product: 'Apple MacBook Pro 14"',
      message: "Price dropped 5.2%",
      time: "2024-01-18 14:30",
      read: true,
    },
    {
      id: 2,
      product: 'iPad Air 11"',
      message: "Back in stock",
      time: "2024-01-18 09:15",
      read: false,
    },
    {
      id: 3,
      product: "Sony Headphones",
      message: "Price increased 3.1%",
      time: "2024-01-17 16:45",
      read: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("active")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAlert, setNewAlert] = useState({
    product: "",
    type: "percentage",
    value: "",
  })

  const handleToggleAlert = (id) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const handleAddAlert = () => {
    if (newAlert.product && newAlert.value) {
      const alert = {
        id: Math.max(...alerts.map((a) => a.id), 0) + 1,
        productTitle: newAlert.product,
        type: newAlert.type,
        value: Number.parseInt(newAlert.value),
        enabled: true,
        createdAt: new Date().toISOString().split("T")[0],
        lastTriggered: null,
      }
      setAlerts([...alerts, alert])
      setNewAlert({ product: "", type: "percentage", value: "" })
      setIsModalOpen(false)
    }
  }

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Alerts</h1>
              <p className="text-foreground-muted">Manage price alerts and notifications</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Create Alert
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-surface-light">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-3 font-medium transition ${
                activeTab === "active"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Active Alerts ({alerts.filter((a) => a.enabled).length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 font-medium transition ${
                activeTab === "history"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Sent Alerts ({sentAlerts.length})
            </button>
          </div>

          {/* Active Alerts Tab */}
          {activeTab === "active" && (
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`card-base flex items-center justify-between ${!alert.enabled ? "opacity-60" : ""}`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">{alert.productTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-foreground-muted">
                        <span>
                          {alert.type === "percentage"
                            ? `Notify when price drops ${alert.value}%`
                            : `Notify when price drops below $${alert.value}`}
                        </span>
                        <span>Created {alert.createdAt}</span>
                        {alert.lastTriggered && <span>Last triggered {alert.lastTriggered}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAlert(alert.id)}
                        className={`px-4 py-2 rounded-lg transition ${
                          alert.enabled
                            ? "bg-success bg-opacity-20 text-success"
                            : "bg-surface-light text-foreground-muted"
                        }`}
                      >
                        {alert.enabled ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-2 hover:bg-surface-light rounded transition text-danger"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-base text-center py-12">
                  <Bell size={40} className="mx-auto text-foreground-muted mb-4 opacity-50" />
                  <p className="text-foreground mb-4">No active alerts</p>
                  <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    Create First Alert
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sent Alerts Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {sentAlerts.length > 0 ? (
                sentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`card-base flex items-center justify-between ${
                      !alert.read ? "border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">{alert.product}</p>
                      <div className="flex items-center gap-4 text-sm text-foreground-muted">
                        <span>{alert.message}</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>

                    {!alert.read && (
                      <span className="px-3 py-1 rounded-full bg-primary bg-opacity-20 text-primary text-xs font-medium">
                        New
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="card-base text-center py-12">
                  <Bell size={40} className="mx-auto text-foreground-muted mb-4 opacity-50" />
                  <p className="text-foreground-muted">No alerts sent yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Alert Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Alert">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product</label>
            <select
              value={newAlert.product}
              onChange={(e) => setNewAlert({ ...newAlert, product: e.target.value })}
              className="input-base"
            >
              <option value="">Select a product</option>
              <option value="Apple MacBook Pro 14">Apple MacBook Pro 14</option>
              <option value="Sony WH-1000XM5 Headphones">Sony WH-1000XM5 Headphones</option>
              <option value="Samsung 4K Smart TV 55">Samsung 4K Smart TV 55</option>
              <option value="iPad Air 11">iPad Air 11</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Alert Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNewAlert({ ...newAlert, type: "percentage" })}
                className={`p-3 rounded-lg border transition ${
                  newAlert.type === "percentage"
                    ? "bg-primary bg-opacity-20 border-primary"
                    : "border-surface-light hover:border-primary"
                }`}
              >
                <p className="text-sm font-medium text-foreground">Price Drop %</p>
              </button>
              <button
                onClick={() => setNewAlert({ ...newAlert, type: "price" })}
                className={`p-3 rounded-lg border transition ${
                  newAlert.type === "price"
                    ? "bg-primary bg-opacity-20 border-primary"
                    : "border-surface-light hover:border-primary"
                }`}
              >
                <p className="text-sm font-medium text-foreground">Price Target</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {newAlert.type === "percentage" ? "Drop Percentage" : "Target Price"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={newAlert.value}
                onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                className="input-base"
                placeholder={newAlert.type === "percentage" ? "e.g., 10" : "e.g., 1800"}
              />
              {newAlert.type === "percentage" && (
                <span className="absolute right-4 top-3 text-foreground-muted">%</span>
              )}
              {newAlert.type === "price" && <span className="absolute right-4 top-3 text-foreground-muted">$</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleAddAlert} className="btn-primary flex-1">
              Create Alert
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
