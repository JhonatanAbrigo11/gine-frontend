import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/widgets/button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
    primary: 'bg-primary-600 hover:bg-primary-700 shadow-primary-200',
  }

  const iconStyles = {
    danger: 'bg-rose-50 text-rose-600',
    warning: 'bg-amber-50 text-amber-600',
    primary: 'bg-primary-50 text-primary-600',
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-clinical-400 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 ${iconStyles[variant]}`}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-clinical-900 mb-2">{title}</h3>
            <p className="text-clinical-500 text-sm leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex w-full gap-3">
              <Button 
                variant="ghost" 
                className="flex-1 rounded-xl h-12" 
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button 
                variant="primary" 
                className={`flex-1 rounded-xl h-12 text-white shadow-lg ${variantStyles[variant]}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
