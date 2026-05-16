import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  message: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
}

const toastStyles = {
  success: 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100/50',
  error: 'bg-white border-rose-100 text-rose-900 shadow-rose-100/50',
  info: 'bg-white border-primary-100 text-primary-900 shadow-primary-100/50',
  warning: 'bg-white border-amber-100 text-amber-900 shadow-amber-100/50',
}

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-rose-500" />,
  info: <Info className="w-5 h-5 text-primary-500" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
}

export const Toast = ({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "flex items-center gap-4 p-4 mb-3 min-w-[340px] max-w-md border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md",
        toastStyles[type]
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50/50 flex items-center justify-center">
        {toastIcons[type]}
      </div>
      <div className="flex-1 pr-2">
        <p className="text-sm font-semibold tracking-tight">
          {message}
        </p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1.5 rounded-xl hover:bg-slate-100/50 transition-colors text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
