import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import '@/shared/styles/index.css'

const rootEl = document.getElementById('root')

if (!rootEl) {
  throw new Error('No se encontró el contenedor #root')
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
