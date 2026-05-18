import { Settings } from 'lucide-react'

export function ConfiguracionPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-clinical-50/50">
      <div className="flex w-full min-w-0 flex-1 flex-col px-6 py-10 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-12 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">
                Administración
              </span>
            </div>
            <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-clinical-900">
              Panel de <span className="text-primary-700">Configuración</span>
            </h1>
            <p className="max-w-lg text-sm font-medium text-clinical-800/60">
              Gestione los parámetros generales de la suite clínica desde cada uno de los sub-módulos dedicados.
            </p>
          </div>
        </header>

        <div className="min-h-0 flex-1 flex items-center justify-center">
          <div className="glass-card max-w-md w-full rounded-[2rem] border border-white bg-white/40 p-10 text-center shadow-lg backdrop-blur-sm space-y-5">
            <div className="h-16 w-16 bg-gradient-to-tr from-primary-100 to-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Settings className="h-8 w-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-clinical-900 tracking-tight">Seleccione un Submódulo</h3>
              <p className="text-xs font-semibold text-clinical-450 leading-relaxed">
                El módulo principal se encuentra vacío. Por favor, haga clic en cualquiera de los submódulos del menú lateral izquierdo (Recetas, Medicamentos o Usuarios) para configurar los detalles del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
