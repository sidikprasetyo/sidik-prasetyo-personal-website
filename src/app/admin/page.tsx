'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import PortfolioManager from '@/components/admin/PortfolioManager'
import ExperienceManager from '@/components/admin/ExperienceManager'
import { FiLogOut } from 'react-icons/fi'
import { LoadingOverlay } from "@/components/LoadingOverlay"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'experience'>('portfolio')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const start = Date.now()

      const { data: { user } } = await supabase.auth.getUser()

      const elapsed = Date.now() - start
      const delay = Math.max(0, 1000 - elapsed) // minimal 1 detik

      setTimeout(() => {
        if (!user) {
          router.replace('/login')
          return
        }
        setUser(user)
        setLoading(false)
      }, delay)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    setLoading(true) // tampilkan loading saat logout juga
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Overlay loading */}
      <LoadingOverlay open={loading} />
      
      {/* Header */}
      {!loading && (
        <>
          <header className="flex items-center justify-between p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 font-medium">
                {user?.user_metadata?.full_name || 'User'}
              </span>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-2 rounded hover:bg-gray-800 transition"
                title="Logout"
              >
                <FiLogOut className="text-red-500 text-xl" />
              </button>
            </div>
          </header>

          {/* Switch Tabs */}
          <div className="flex justify-center mt-6">
            <div className="flex bg-gray-800 rounded-full p-1">
              <button
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'portfolio'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolios
              </button>
              <button
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'experience'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('experience')}
              >
                Experiences
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="p-6">
            {activeTab === 'portfolio' && <PortfolioManager />}
            {activeTab === 'experience' && <ExperienceManager />}
          </main>

          {/* Logout Modal */}
          {showLogoutModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                <h2 className="text-lg font-semibold mb-4">Konfirmasi Logout</h2>
                <p className="text-gray-400 mb-6">
                  Apakah Anda yakin ingin keluar dari dashboard?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
