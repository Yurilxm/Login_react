import { Toaster } from 'react-hot-toast'
import ParticlesBackground from '../components/ParticlesBackground'

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient overflow-hidden">
      
      {/* Background animado */}
      <ParticlesBackground interactive={true} />

      {/* Conteúdo */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

      <Toaster position="top-right" />
    </div>
  )
}