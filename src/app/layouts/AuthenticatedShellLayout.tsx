import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar, SIDEBAR_COLLAPSED_WIDTH } from '@/features/sidebar/ui/organisms/AppSidebar'

const SIDEBAR_EXPANDED_PL = 'min(18rem, 84vw)'

/** Layout con sidebar persistente entre rutas protegidas (dashboard, configuración, …). */
export function AuthenticatedShellLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-dvh bg-rose-dawn-50">
      <AppSidebar expanded={sidebarExpanded} onExpandedChange={setSidebarExpanded} />

      <main
        id="contenido-principal"
        className="min-h-dvh min-w-0 transition-[padding-left] duration-300 ease-out"
        style={{
          paddingLeft: sidebarExpanded ? SIDEBAR_EXPANDED_PL : SIDEBAR_COLLAPSED_WIDTH,
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
