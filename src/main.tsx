import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope'
import '@fontsource-variable/dm-sans'
import './index.css'
import App from './App'
import { SessaoProvider } from './contexto/sessaoProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <SessaoProvider>
                <App />
            </SessaoProvider>
        </BrowserRouter>
    </StrictMode>,
)