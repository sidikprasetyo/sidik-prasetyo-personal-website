'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import { LoadingOverlay } from "@/components/LoadingOverlay"

export default function LoginPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const start = Date.now()

      const { data: { user } } = await supabase.auth.getUser()

      const elapsed = Date.now() - start
      const delay = Math.max(0, 1000 - elapsed) // minimal 1 detik (1000 ms)

      setTimeout(() => {
        if (user) {
          router.replace('/admin')
        } else {
          setLoading(false)
        }
      }, delay)
    }
    checkUser()
  }, [router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://sidik-prasetyo.vercel.app/admin`,
      },
    })
    if (error) {
      console.error('Google login error:', error.message)
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingOverlay open={true} />
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 bg-black text-white border border-white px-6 py-3 rounded-full 
                   shadow-[0_0_15px_rgba(255,255,255,0.2)] 
                   hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]
                   active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <FcGoogle size={22} />
        <span className="font-medium">Login with Google</span>
      </button>
    </div>
  )
}
