import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Eye,
  FileUp,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/widgets/button'
import { cn } from '@/shared/lib/cn'
import { toast } from 'sonner'
import { orderService } from '@/modules/orders/services/order.service'
import type { MedicalOrder } from '@/modules/orders/types/order.types'

interface ResultsManagerModalProps {
  isOpen: boolean
  onClose: () => void
  order: MedicalOrder
  onUpdate: () => void
}

type ModalView = 'list' | 'upload'

export const ResultsManagerModal: React.FC<ResultsManagerModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdate
}) => {
  const [view, setView] = useState<ModalView>('list')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  const BASE_URL = API_URL.replace('/api', '')

  const handleDelete = async (resultId: string) => {
    try {
      setDeletingId(resultId)
      await orderService.deleteResult(order.id, resultId)
      toast.success('Archivo eliminado correctamente')
      onUpdate()
    } catch (error) {
      console.error('Error deleting result:', error)
      toast.error('Error al eliminar el archivo')
    } finally {
      setDeletingId(null)
    }
  }

  const handlePreview = (url: string) => {
    window.open(`${BASE_URL}${url}`, '_blank')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const currentCount = order.results?.length || 0
    
    if (currentCount + uploadFiles.length + selectedFiles.length > 5) {
      toast.error('Solo se permiten hasta 5 archivos en total')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type))

    if (validFiles.length !== selectedFiles.length) {
      toast.warning('Algunos archivos fueron omitidos por no ser válidos')
    }

    setUploadFiles(prev => [...prev, ...validFiles])
  }

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return

    try {
      setUploading(true)
      await orderService.uploadResults(order.id, uploadFiles)
      toast.success('Archivos subidos exitosamente')
      setUploadFiles([])
      setView('list')
      onUpdate()
    } catch (error) {
      console.error('Error uploading:', error)
      toast.error('Error al subir los archivos')
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-rose-500" />
    return <ImageIcon className="h-6 w-6 text-indigo-500" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-clinical-900/60 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-clinical-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-clinical-50 bg-clinical-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {view === 'upload' && (
                  <button 
                    onClick={() => setView('list')}
                    className="h-10 w-10 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                  view === 'list' ? "bg-emerald-600 shadow-emerald-100" : "bg-primary-600 shadow-primary-100 text-white"
                )}>
                  {view === 'list' ? <ClipboardCheck className="h-6 w-6 text-white" /> : <FileUp className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-clinical-900 tracking-tight">
                    {view === 'list' ? 'Gestión de Resultados' : 'Subir Resultados'}
                  </h3>
                  <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">
                    {order.patient?.nombres} {order.patient?.apellidos} • {order.secuencial}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 text-clinical-300 transition-all flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
              
              {view === 'list' ? (
                <>
                  <div className="flex items-center justify-between px-2">
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Documentos Cargados</h4>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{order.results?.length || 0} de 5 archivos</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                     {order.results?.map((result) => (
                        <motion.div 
                          layout
                          key={result.id} 
                          className="group relative p-4 rounded-3xl bg-white border border-clinical-100 hover:border-primary-200 hover:shadow-md transition-all flex items-center justify-between"
                        >
                           <div className="flex items-center gap-4 min-w-0">
                              <div className="h-12 w-12 rounded-2xl bg-clinical-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                 {getFileIcon(result.fileType)}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-black text-clinical-900 truncate pr-4">{result.filename}</p>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">{new Date(result.createdAt).toLocaleDateString()}</span>
                                    <span className="h-1 w-1 rounded-full bg-clinical-200" />
                                    <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest truncate">{result.fileType.split('/')[1]}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handlePreview(result.url)}
                                className="h-10 w-10 rounded-xl bg-clinical-50 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm border border-transparent hover:border-primary-100"
                              >
                                 <ExternalLink className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(result.id)}
                                disabled={deletingId === result.id}
                                className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm border border-transparent",
                                  deletingId === result.id 
                                    ? "bg-rose-50 text-rose-500 border-rose-100 animate-pulse" 
                                    : "bg-clinical-50 text-clinical-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100"
                                )}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </div>
                        </motion.div>
                     ))}

                     {(!order.results || order.results.length === 0) && (
                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                           <FileUp className="h-12 w-12 text-clinical-200 mb-4" />
                           <p className="text-xs font-black text-clinical-900 uppercase tracking-widest">No hay archivos cargados</p>
                        </div>
                     )}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                   {/* Dropzone Area */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-clinical-50/20 border-clinical-100 hover:border-primary-400 hover:bg-primary-50/30",
                        (order.results?.length || 0) + uploadFiles.length >= 5 && "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,image/jpeg,image/png,image/jpg"
                      />
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                        <Upload className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-clinical-900 uppercase tracking-widest">Seleccionar Archivos</p>
                        <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-1">PDF o Imágenes (Máx. 5 en total)</p>
                      </div>
                    </div>

                    {/* Pending Upload Files */}
                    {uploadFiles.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest px-2">Archivos por Subir</h4>
                        <div className="grid grid-cols-1 gap-2">
                           {uploadFiles.map((file, idx) => (
                              <div key={idx} className="p-3 rounded-2xl bg-primary-50/50 border border-primary-100 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                                       {file.type.includes('pdf') ? <FileText className="h-4 w-4 text-rose-500" /> : <ImageIcon className="h-4 w-4 text-indigo-500" />}
                                    </div>
                                    <span className="text-xs font-bold text-clinical-900 truncate max-w-[200px]">{file.name}</span>
                                 </div>
                                 <button onClick={() => removeUploadFile(idx)} className="text-rose-500 hover:bg-rose-100 p-1.5 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                       <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                       <p className="text-[10px] font-bold text-amber-700 leading-normal">
                          Asegúrese de que los archivos sean legibles. Una vez confirmada la subida, se guardarán permanentemente en el sistema.
                       </p>
                    </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-clinical-50/30 border-t border-clinical-50 flex gap-4">
              {view === 'list' ? (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={onClose} 
                    className="flex-1 h-12 rounded-2xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest"
                  >
                    Cerrar
                  </Button>
                  {(order.results?.length || 0) < 5 && (
                    <Button 
                      variant="primary" 
                      onClick={() => setView('upload')}
                      className="flex-[2] h-12 rounded-2xl shadow-xl shadow-primary-100 font-black text-xs uppercase tracking-widest"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Añadir Archivos
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={() => { setView('list'); setUploadFiles([]); }} 
                    className="flex-1 h-12 rounded-2xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest"
                  >
                    Regresar
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleUpload} 
                    loading={uploading}
                    disabled={uploadFiles.length === 0}
                    className="flex-[2] h-12 rounded-2xl shadow-xl shadow-primary-100 font-black text-xs uppercase tracking-widest"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    Confirmar Subida
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
