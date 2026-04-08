import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login({ onSwitch, onForgotPassword, initialEmail = '' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [showInactiveModal, setShowInactiveModal] = useState(false)

  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  // Validação em tempo real
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [email])

  const isPasswordFilled = password.length > 0
  const isTwoFactorValid = twoFactorCode.length === 6

  const isFormValid = useMemo(() => {
    return email && isEmailValid && isPasswordFilled && isTwoFactorValid
  }, [email, isEmailValid, isPasswordFilled, isTwoFactorValid])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/robot')
    }
  }, [isAuthenticated, navigate])

  async function handleSubmit() {
    if (!isFormValid) return

    const result = await login(email, password, rememberMe, twoFactorCode)

    if (result?.error) {
      // 🎯 Verifica se é o erro especial de conta inativa
      if (result.error === 'account_inactive') {
        setShowInactiveModal(true)
      } else {
        // Outros erros (senha errada, 2FA inválido, etc)
        toast.error(result.error)
      }
      return
    }

    toast.success('Login realizado com sucesso!')
    navigate('/robot')
  }

  function handleTwoFactorKeyPress(e) {
    if (e.key === 'Enter' && isFormValid) {
      handleSubmit()
    }
  }

  return (
    <div className="relative w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 my-4 max-h-[85vh] overflow-y-auto">
      
      {/* Botão Criar conta */}
      <button
        onClick={onSwitch}
        className="absolute top-4 right-4 flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-105 group"
        title="Criar conta"
      >
        <span className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-300">
          Criar conta
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-blue-600/50 transition-all duration-300">
          <i className="ri-user-add-line text-lg" />
        </div>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-gray-400 text-sm">
          Entre com suas credenciais para continuar
        </p>
      </div>

      <div className="space-y-4">
        
        {/* EMAIL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Email
          </label>

          <div className="relative">
            {/* Ícone */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <i className="ri-user-fill text-lg" />
            </div>

            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors ${
                email && !isEmailValid ? 'border-red-500' : ''
              }`}
            />
          </div>

          {email && !isEmailValid && (
            <p className="text-xs text-red-400 mt-1">Email inválido</p>
          )}
        </div>

        {/* SENHA */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Senha
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <i className={`ri-eye${showPassword ? '-line' : '-off-line'}`} />
            </button>
          </div>
        </div>

        {/* 🔐 2FA */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Código de autenticação
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder=" Digite o código 2FA"
              value={twoFactorCode}
              onChange={(e) =>
                setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              onKeyPress={handleTwoFactorKeyPress}
              maxLength={6}
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors text-center text-2xl tracking-[0.4em] font-mono py-3"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <i className="ri-shield-keyhole-fill text-xl text-gray-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <i className="ri-information-line mr-1" />
            Digite o código do seu app autenticador
          </p>
        </div>

        {/* REMEMBER + FORGOT */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 accent-blue-500 cursor-pointer"
            />
            <span className="text-gray-300">Lembrar de mim</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>

      <div className="h-6" />

      <Button onClick={handleSubmit} disabled={!isFormValid}>
        Entrar
      </Button>

      {/* Modal de conta inativa */}
      {showInactiveModal && createPortal (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-sm bg-gray-900 p-8 rounded-2xl shadow-2xl z-10 border border-blue-500/30">
            
            <button
              onClick={() => setShowInactiveModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <i className="ri-close-line text-xl" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-check-line text-4xl text-blue-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                Primeiro acesso!
              </h3>
              
              <p className="text-gray-300 mb-4">
                Sua conta foi criada com sucesso e está aguardando aprovação do administrador.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <i className="ri-mail-line text-2xl text-blue-400 mb-2 block" />
                <p className="text-sm text-gray-300">
                  Você receberá um email em <strong>{email}</strong> quando sua conta for ativada.
                </p>
              </div>

              <Button
                onClick={() => setShowInactiveModal(false)}
                className="w-full"
              >
                Entendi
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Login