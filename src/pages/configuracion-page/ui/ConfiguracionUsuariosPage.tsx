import { ClinicalUsersSectionEditor } from '@/features/site-config/ui/sections/ClinicalUsersSectionEditor'

export function ConfiguracionUsuariosPage() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-clinical-50/50">
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
              Control de <span className="text-primary-700">Usuarios y Accesos</span>
            </h1>
            <p className="max-w-lg text-sm font-medium text-clinical-800/60">
              Administre las cuentas del personal médico y administrativo, asigne nombres de usuario, suspenda el acceso o restablezca contraseñas de forma segura.
            </p>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <div className="glass-card flex min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-white bg-white/40 p-6 sm:p-8">
            <ClinicalUsersSectionEditor />
          </div>
        </div>
      </div>
    </div>
  )
}
