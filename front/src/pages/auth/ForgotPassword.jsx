"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container-app bg-gradient-to-br from-background to-surface">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">💰 PriceWatch</h1>
            <p className="text-foreground-muted">Reset your password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-base space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{sent ? "Check Your Email" : "Forgot Password?"}</h2>

            {sent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success bg-opacity-10 border border-success text-success text-sm">
                  Reset link sent to {email}. Check your email to reset your password.
                </div>
                <Link to="/login" className="btn-primary w-full block text-center">
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-foreground-muted text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

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

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            )}

            {/* Back to Login Link */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition"
            >
              <ArrowLeft size={18} />
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
