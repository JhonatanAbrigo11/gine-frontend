import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AppSidebar, SIDEBAR_COLLAPSED_WIDTH } from '@/features/sidebar/ui/organisms/AppSidebar'

const SIDEBAR_EXPANDED_PL = '16rem'

/** Layout con sidebar persistente entre rutas protegidas (dashboard, configuración, …). */
export function AuthenticatedShellLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-clinical-50/50 flex flex-col">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-clinical-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="font-bold text-clinical-900 tracking-tight">GineCare</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-clinical-50 text-clinical-600"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <div className="flex flex-1">
        <AppSidebar 
          expanded={sidebarExpanded} 
          onExpandedChange={setSidebarExpanded} 
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <main
          id="contenido-principal"
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-out",
            // Desktop padding logic
            "lg:pl-[var(--sidebar-width)]"
          )}
          style={{
            ['--sidebar-width' as any]: sidebarExpanded ? SIDEBAR_EXPANDED_PL : SIDEBAR_COLLAPSED_WIDTH
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
