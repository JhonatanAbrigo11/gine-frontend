import { SidebarGlyph } from '@/features/sidebar/ui/atoms/SidebarGlyph'

export function SidebarFigureRow() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <SidebarGlyph title="Cuidado preventivo">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
          <path
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6-4.5-6-9.5a6 6 0 1 1 12 0c0 5-6 9.5-6 9.5Z"
          />
          <path strokeWidth="1.7" strokeLinecap="round" d="M12 10.5h.01" />
        </svg>
      </SidebarGlyph>
      <SidebarGlyph title="Seguimiento clínico">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
          <path
            strokeWidth="1.7"
            strokeLinecap="round"
            d="M4.5 12h3l2-4 4 8 2-4h3"
          />
        </svg>
      </SidebarGlyph>
      <SidebarGlyph title="Bienestar integral">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
          <path
            strokeWidth="1.7"
            strokeLinecap="round"
            d="M12 4.5c-1.8 2-4 3.4-4 6.2a2.8 2.8 0 1 0 5.6 0c0-2.8-2.2-4.2-4-6.2Z"
          />
          <path strokeWidth="1.7" strokeLinecap="round" d="M12 10.7V20" />
        </svg>
      </SidebarGlyph>
    </div>
  )
}
