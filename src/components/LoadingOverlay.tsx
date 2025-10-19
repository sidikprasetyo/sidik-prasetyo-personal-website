"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function LoadingOverlay({ open }: { open: boolean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fefefe]">
      {/* Lingkaran animasi */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-20 h-20 text-black" />
      </motion.div>
    </div>
  )
}
