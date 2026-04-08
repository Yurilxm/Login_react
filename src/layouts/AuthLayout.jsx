import { Toaster } from 'react-hot-toast'
import ParticlesBackground from '../components/ParticlesBackground'

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient overflow-hidden pb-40 px-4">
      
      {/* Background animado */}
      <ParticlesBackground interactive={true} />

      {/* Conteúdo com scroll se necessário */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#F3F4F6',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#1F2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1F2937',
            },
          },
        }}
      />
    </div>
  )
}