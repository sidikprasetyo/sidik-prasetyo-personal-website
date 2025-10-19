"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingOverlay } from "@/components/LoadingOverlay"

export default function LoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 500) // smooth loading
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <>
      <LoadingOverlay open={loading} />
      {children}
    </>
  )
}
