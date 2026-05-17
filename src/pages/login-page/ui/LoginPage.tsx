import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react'

import { useAuth } from '@/features/login/model/auth-context'
import { LoginForm } from '@/features/login/ui/organisms/LoginForm'
import { ROUTES } from '@/shared/config/routes'

export function LoginPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return (
    <div className="min-h-dvh flex overflow-hidden bg-white select-none">
      {/* LEFT PANEL: Light & Premium Clinical Branding (Only on large screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-50/60 relative overflow-hidden flex-col justify-between p-16 border-r border-clinical-100">
        {/* Soft, beautiful light pastel glowing blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-200/30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-200/25 blur-[120px] pointer-events-none" />
        <div className="absolute top-[35%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-200/20 blur-[110px] pointer-events-none" />
        
        {/* Modern, light geometric grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
            <Heart className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-widest text-clinical-900 uppercase leading-none">GineClinic</h1>
            <p className="text-[10px] text-clinical-450 mt-1 uppercase tracking-widest font-bold">Alta Especialidad</p>
          </div>
        </div>

        {/* Center Premium Card */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-600">Enfoque Humano & Científico</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-[1.15] text-clinical-900">
            Ginecología y Obstetricia <span className="text-primary-650">de Alta Especialidad</span>
          </h2>
          <p className="text-sm font-bold text-clinical-550 leading-relaxed">
            Plataforma médica de vanguardia para el seguimiento gestacional, monitoreo ecográfico y gestión clínica de pacientes con un estándar de excelencia médica.
          </p>

          {/* Clinical Features grid */}
          <div className="grid grid-cols-2 gap-5 pt-4">
            <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/70 border border-clinical-100 shadow-sm shadow-clinical-50/50 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-clinical-850">Monitoreo Obstétrico</p>
                <p className="text-[9px] font-bold text-clinical-450 mt-0.5">Curvas y FPP automáticos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/70 border border-clinical-100 shadow-sm shadow-clinical-50/50 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black text-clinical-850">Acceso Seguro</p>
                <p className="text-[9px] font-bold text-clinical-450 mt-0.5">Protección de datos HIPAA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 flex items-center justify-between border-t border-clinical-100 pt-6 text-[10px] text-clinical-450 font-bold uppercase tracking-widest">
          <span>Ginecología y Obstetricia con Enfoque Humano</span>
          <span>v1.5.0</span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Column */}
      <div className="w-full lg:w-1/2 min-h-dvh flex flex-col justify-center items-center px-6 sm:px-12 py-16 bg-clinical-50/15 relative">
        {/* Soft aura on mobile */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-primary-100/40 blur-[90px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile-only logo header */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-black tracking-widest text-clinical-900 uppercase">GineClinic</span>
          </div>

          <LoginForm />
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-clinical-400">
            SISTEMA DE GESTIÓN CLÍNICA DE ALTA ESPECIALIDAD • SECURE ACCESS
          </p>
        </div>
      </div>
    </div>
  )
}
