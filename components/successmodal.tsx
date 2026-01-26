'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  redirectTo?: string
}

export default function SuccessModal({ isOpen, onClose, title, message, redirectTo }: SuccessModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen && redirectTo) {
      const timer = setTimeout(() => {
        router.push(redirectTo)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, redirectTo, router])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>
                
                {redirectTo && (
                  <p className="text-sm text-slate-400">
                    Redirecting to login in 3 seconds...
                  </p>
                )}
                
                <div className="mt-8 flex gap-4">
                  {redirectTo ? (
                    <button
                      onClick={() => router.push(redirectTo)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold transition-all"
                    >
                      Go to Login
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold transition-all"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
