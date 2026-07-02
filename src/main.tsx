import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ProjectProvider } from '@/context/ProjectContext'
import { initThemeFromStorage } from '@/hooks/use-theme'
import './index.css'
import App from './App.tsx'

initThemeFromStorage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <BrowserRouter>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
)
