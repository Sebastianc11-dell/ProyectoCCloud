"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Mail, Lock } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await login(email, password)
    setLoading(false)
    if (success) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="container-app bg-gradient-to-br from-background to-surface">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">PriceWatch</h1>
            <p className="text-foreground-muted">Monitor prices, never overpay again</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="card-base space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-danger bg-opacity-10 border border-danger text-danger text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-foreground-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-10"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Register Link */}
            <p className="text-center text-foreground-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:text-primary-dark transition font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
