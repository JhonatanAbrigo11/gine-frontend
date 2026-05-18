import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Printer, X } from 'lucide-react'
import { Button } from '@/widgets/button'

interface PdfPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  title?: string
  subtitle?: string
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Previsualización de Receta Profesional',
  subtitle = 'VERIFIQUE LOS DATOS ANTES DE IMPRIMIR'
}) => {
  const handlePrint = () => {
    if (!pdfUrl) return
    const win = window.open(pdfUrl, '_blank')
    if (win) {
      win.focus()
      // Give it a moment to load then print
      setTimeout(() => {
        win.print()
      }, 500)
    } else {
      // Fallback: trigger print on current page if popup is blocked
      window.print()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && pdfUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="h-20 border-b border-clinical-100 flex items-center justify-between px-8 bg-clinical-50/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-clinical-900">{title}</h3>
                  <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handlePrint} 
                  variant="secondary" 
                  className="h-11 px-6 rounded-xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  <Printer className="h-4 w-4 mr-2" /> Imprimir
                </Button>
                <button 
                  onClick={onClose}
                  className="h-11 w-11 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* PDF View (iframe) */}
            <div className="flex-1 bg-clinical-100/50 p-8 overflow-hidden">
              <iframe 
                src={pdfUrl} 
                className="w-full h-full rounded-2xl shadow-inner border border-clinical-200 bg-white" 
                title="Visualizador de PDF"
              />
            </div>

            {/* Footer */}
            <div className="h-20 border-t border-clinical-100 flex items-center justify-center px-8 bg-white">
              <p className="text-[11px] font-bold text-clinical-400 text-center">
                Esta receta cumple con el Reglamento de Emisión de Recetas Médicas de la ACESS (Ecuador). 
                Válida únicamente con firma y sello del profesional.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
