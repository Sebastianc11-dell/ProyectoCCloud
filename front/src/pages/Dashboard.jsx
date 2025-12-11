"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { TrendingUp, TrendingDown, AlertCircle, Package } from "lucide-react"
import { api } from "../services/api"

export default function Dashboard() {
  const [stats, setStats] = useState({
    tracked: 0,
    activeAlerts: 0,
    updates: 0,
    highestVariation: 0,
  })
  const [recentTracking, setRecentTracking] = useState([])
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [trackingRes, alertsRes] = await Promise.all([api.get("/api/tracking"), api.get("/api/alerts")])
        const tracking = trackingRes.data || []
        const alertsData = alertsRes.data || []

        setStats({
          tracked: tracking.length,
          activeAlerts: alertsData.length,
          updates: 0,
          highestVariation: 0,
        })
        setRecentTracking(
          tracking.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title || item.product?.title,
            price: item.price ?? item.product?.price ?? null,
            change: null,
            lastUpdate: item.updatedAt || item.updated_at || "",
          })),
        )
        setAlerts(
          alertsData.slice(0, 5).map((a) => ({
            id: a.id,
            product: a.title || a.product?.title,
            alert: `Umbral: ${a.threshold}`,
            time: a.updated_at || a.created_at || "",
          })),
        )
      } catch (err) {
        setError("No pudimos cargar tus datos")
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Panel principal</h1>
            <p className="text-foreground-muted">Monitorea tus productos vigilados y gestiona las alertas</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tracked Products */}
            <div className="card-base">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Productos vigilados</p>
                  <p className="text-3xl font-bold text-foreground">{stats.tracked}</p>
                </div>
                <Package size={40} className="text-primary opacity-20" />
              </div>
            </div>

            {/* Active Alerts */}
            <div className="card-base">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Alertas activas</p>
                  <p className="text-3xl font-bold text-danger">{stats.activeAlerts}</p>
                </div>
                <AlertCircle size={40} className="text-danger opacity-20" />
              </div>
            </div>

            {/* Price Updates */}
            <div className="card-base">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Actualizaciones de precio</p>
                  <p className="text-3xl font-bold text-foreground">{stats.updates}</p>
                </div>
                <TrendingUp size={40} className="text-primary opacity-20" />
              </div>
            </div>

            {/* Highest Variation */}
            <div className="card-base">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-muted text-sm mb-1">Mayor variacion</p>
                  <p className="text-3xl font-bold text-success">{stats.highestVariation}%</p>
                </div>
                <TrendingDown size={40} className="text-success opacity-20" />
              </div>
            </div>
          </div>

          {/* Recent Tracking and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Price Updates */}
            <div className="card-base">
              <h2 className="text-xl font-bold text-foreground mb-6">Actualizaciones recientes</h2>
              <div className="space-y-4">
                {recentTracking.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-light border border-surface-light"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-foreground-muted">{item.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${item.price}</p>
                      <p className={`text-sm font-medium ${item.change < 0 ? "status-down" : "status-up"}`}>
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            <div className="card-base">
              <h2 className="text-xl font-bold text-foreground mb-6">Alertas recientes</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-lg bg-surface-light border border-surface-light">
                    <p className="font-medium text-foreground mb-1">{alert.product}</p>
                    <p className="text-sm text-foreground-muted mb-2">{alert.alert}</p>
                    <p className="text-xs text-foreground-muted">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
