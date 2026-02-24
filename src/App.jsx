import { Toaster } from 'react-hot-toast'
import Auth from './pages/Auth'
import ParticlesBackground from './components/ParticlesBackground'

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient overflow-hidden">
      
      {/* Background animado */}
      <ParticlesBackground />

      {/* Conteúdo */}
      <div className="relative z-10 w-full flex justify-center">
        <Auth />
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default App