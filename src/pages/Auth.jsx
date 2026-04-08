import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import ForgotPasswordModal from '../components/ForgotPasswordModal'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)  // ← Começa no Login
  const [prefilledEmail, setPrefilledEmail] = useState('')
  const [showForgot, setShowForgot] = useState(false)

  // Função para alternar para o Login (pode receber email)
  const switchToLogin = (email = '') => {
    setPrefilledEmail(email)
    setIsLogin(true)
  }

  // Função para alternar para o Register
  const switchToRegister = () => {
    setIsLogin(false)
  }

  return (
    <>
      <div className="relative w-full max-w-md h-[520px] perspective mt-[-30px]">
        <div
          className={`relative w-full h-full transition-transform duration-800 ease-in-out transform-style-preserve-3d
          ${!isLogin ? 'rotate-y-180' : ''}`}
        >
          {/* FRENTE: Login */}
          <div className="absolute inset-0 backface-hidden">
            <Login 
              onSwitch={switchToRegister}
              onForgotPassword={() => setShowForgot(true)}
              initialEmail={prefilledEmail}  // ← Passa o email preenchido
            />
          </div>

          {/* VERSO: Register */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden">
            <Register 
              onSwitch={switchToLogin}  // ← Passa a função que aceita email
            />
          </div>
        </div>
      </div>

      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </>
  )
}

export default Auth