"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Phone, Save, LogOut, Bell, Lock, Eye, EyeOff } from "lucide-react"

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user?.email?.split("@")[0] || "",
    email: user?.email || "",
    phone: user?.phone || "+1 (555) 123-4567",
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
    setSavedMessage("Profile updated successfully")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // TODO: Call API to change password
    setSavedMessage("Password changed successfully")
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

  return (
    <div className="container-app">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-foreground-muted">Manage your profile and preferences</p>
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
              Profile
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
              Security
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
              Notifications
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
                    <h3 className="text-xl font-bold text-foreground mb-2">Profile Picture</h3>
                    <p className="text-foreground-muted text-sm mb-4">Upload a new profile picture</p>
                    <button className="btn-secondary">Upload Picture</button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card-base">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
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
                    <p className="text-xs text-foreground-muted mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
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
                    Save Changes
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
                  Change Password
                </h3>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
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
                    Change Password
                  </button>
                </div>
              </div>

              {/* Account Danger Zone */}
              <div className="card-base border border-danger border-opacity-30 bg-danger bg-opacity-5">
                <h3 className="text-lg font-bold text-danger mb-4">Danger Zone</h3>
                <p className="text-foreground-muted text-sm mb-4">
                  Logout from all devices or permanently delete your account.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleLogout} className="flex-1 btn-primary flex items-center justify-center gap-2">
                    <LogOut size={20} />
                    Logout
                  </button>
                  <button className="flex-1 px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:bg-opacity-10 font-medium transition">
                    Delete Account
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
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light">
                    <div>
                      <p className="font-medium text-foreground mb-1">Email Notifications</p>
                      <p className="text-sm text-foreground-muted">Receive email updates about your tracked products</p>
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
                      <p className="font-medium text-foreground mb-1">Price Drop Alerts</p>
                      <p className="text-sm text-foreground-muted">Get notified when prices drop on tracked products</p>
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
                      <p className="font-medium text-foreground mb-1">Weekly Report</p>
                      <p className="text-sm text-foreground-muted">
                        Receive a weekly summary of your price monitoring data
                      </p>
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
                      <p className="font-medium text-foreground mb-1">Marketing Emails</p>
                      <p className="text-sm text-foreground-muted">
                        Receive promotional offers and feature announcements
                      </p>
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
                      setSavedMessage("Notification preferences updated")
                      setTimeout(() => setSavedMessage(""), 3000)
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                  >
                    <Save size={20} />
                    Save Preferences
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
