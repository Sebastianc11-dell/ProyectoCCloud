"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Calendar } from "lucide-react"

export default function PriceHistory() {
  const { productId } = useParams()
  const [timeRange, setTimeRange] = useState("30")

  // Mock product data
  const product = {
    id: productId,
    title: 'Apple MacBook Pro 14" M3 Max',
    currentPrice: 1899,
  }

  // Mock price history data for 90 days
  const generateChartData = (days) => {
    const data = []
    const basePrice = 2100
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const variance = Math.sin(i * 0.1) * 150 + Math.random() * 100 - 50
      const price = Math.round(basePrice + variance)
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price,
        fullDate: date.toISOString().split("T")[0],
      })
    }
    return data
  }

  const allData = generateChartData(90)
  const chartData = timeRange === "7" ? allData.slice(-7) : timeRange === "30" ? allData.slice(-30) : allData

  // Calculate statistics
  const prices = chartData.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  const variation = (((maxPrice - minPrice) / minPrice) * 100).toFixed(2)

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Price History</h1>
            <p className="text-foreground-muted">{product.title}</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Current Price</p>
              <p className="text-2xl font-bold text-primary">${product.currentPrice}</p>
            </div>
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Lowest Price</p>
              <p className="text-2xl font-bold text-success">${minPrice}</p>
            </div>
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Highest Price</p>
              <p className="text-2xl font-bold text-danger">${maxPrice}</p>
            </div>
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Average Price</p>
              <p className="text-2xl font-bold text-foreground">${avgPrice}</p>
            </div>
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Variation</p>
              <p className="text-2xl font-bold text-warning">{variation}%</p>
            </div>
            <div className="card-base">
              <p className="text-foreground-muted text-sm mb-2">Savings</p>
              <p className="text-2xl font-bold text-success">${(maxPrice - product.currentPrice).toFixed(0)}</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="card-base mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Select Time Range</h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {["7", "30", "90"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition ${
                    timeRange === range ? "bg-primary text-white" : "btn-secondary"
                  }`}
                >
                  Last {range} Days
                </button>
              ))}
            </div>
          </div>

          {/* Price Chart */}
          <div className="card-base mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">Price Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#cbd5e1" style={{ fontSize: "12px" }} />
                <YAxis stroke="#cbd5e1" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Price Changes */}
          <div className="card-base">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Changes</h3>
            <div className="space-y-3">
              {chartData
                .slice(-5)
                .reverse()
                .map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-light">
                    <div>
                      <p className="text-foreground font-medium">{entry.date}</p>
                      <p className="text-sm text-foreground-muted">{entry.fullDate}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">${entry.price}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
