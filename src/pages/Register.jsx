import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

function Register({ onSwitch }) {
  const { register, verify2FA } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordRules = validatePassword(password)
  const rulesCount = Object.values(passwordRules).filter(Boolean).length
  const isPasswordValid = rulesCount === 5
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const [loading2FA, setLoading2FA] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    if (firstName && lastName) {
      // Gera username base
      const baseUsername = `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9.]/g, '')
      
      // Adiciona um número aleatório para garantir unicidade
      const randomSuffix = Math.floor(Math.random() * 10000)
      const uniqueUsername = `${baseUsername}${randomSuffix}`
      
      setUsername(uniqueUsername)
    } else {
      setUsername('')
    }
  }, [firstName, lastName])

  async function handleSubmit() {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos')
      return
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      toast.error('Nome e sobrenome devem ter pelo menos 2 caracteres')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Digite um email válido')
      return
    }

    if (!isPasswordValid) {
      toast.error('A senha não atende aos requisitos')
      return
    }

    if (!passwordsMatch) {
      toast.error('As senhas não coincidem')
      return
    }

    const result = await register(email, password, firstName.trim(), lastName.trim(), username)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Conta criada!', { duration: 2000 })

    if (result?.qrCode) {
      setQrCode(result.qrCode)
      setShow2FAModal(true)
    }
  }

  async function confirm2FA() {
    if (code.length !== 6) {
      toast.error('Digite um código válido')
      return
    }

    setLoading2FA(true)
    const result = await verify2FA(email, code)
    setLoading2FA(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('2FA configurado com sucesso!')
    
    setShow2FAModal(false)
    
    // Passa o email para a tela de login
    onSwitch(email)
  }

  return (
    <>
      <div className="relative w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-5 rounded-2xl shadow-2xl border border-gray-700/50">
        <button
          onClick={() => onSwitch()}
          className="absolute top-4 right-4 flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group"
        >
          <span className="text-xs opacity-0 group-hover:opacity-100">Fazer login</span>
          <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-blue-600/50">
            <i className="ri-login-box-line text-lg" />
          </div>
        </button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1 mb-7">Criar conta</h1>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Nome</label>
              <Input
                type="text"
                placeholder="Seu nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-sm py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Sobrenome</label>
              <Input
                type="text"
                placeholder="Seu sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-sm py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Nome de usuário</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Gerado automaticamente"
                value={username}
                readOnly
                className="bg-gray-800/30 border-gray-700 text-gray-400 cursor-not-allowed pr-8 text-sm py-2"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <i className="ri-lock-line text-gray-500 text-base" />
              </div>
            </div>
            {firstName && lastName && (
              <p className="text-xs text-gray-500 mt-1">
                <i className="ri-information-line mr-0.5" />
                Username único gerado automaticamente
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-sm py-2 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <i className="ri-user-fill text-lg" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Senha</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-blue-500 pr-10 text-sm py-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <i className={`ri-eye${showPassword ? '' : '-off'}-line text-base`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Confirmar senha</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-blue-500 pr-10 text-sm py-2"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <i className={`ri-eye${showConfirmPassword ? '' : '-off'}-line text-base`} />
              </button>
            </div>
          </div>

          {password && (
            <div className="animate-fadeIn">
              <PasswordStrength level={rulesCount} />
            </div>
          )}

          <div className="bg-gray-800/30 rounded-lg p-3.5 border border-gray-700/50">
            <p className="text-xs font-large text-gray-400 mb-3">Sua senha precisa conter:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <RuleItem valid={passwordRules.length} text="8-64 caracteres" />
              <RuleItem valid={passwordRules.uppercase} text="1 maiúscula" />
              <RuleItem valid={passwordRules.lowercase} text="1 minúscula" />
              <RuleItem valid={passwordRules.special} text="1 caractere especial" />
              <RuleItem valid={passwordRules.number} text="1 número" />
              <RuleItem valid={passwordsMatch} text="Senhas coincidem" />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isPasswordValid || !passwordsMatch}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4 text-sm"
          >
            Criar conta
          </Button>
        </div>
      </div>

      {show2FAModal && createPortal (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay escuro - NÃO fecha ao clicar, sem onClick */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal - sem botão X, sem forma de fechar */}
          <div className="relative w-full max-w-sm backdrop-blur-sm bg-white/10 p-6 rounded-lg shadow-lg z-10">

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-keyhole-fill text-3xl text-blue-400" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">
                Configurar Autenticação
              </h2>
              <p className="text-gray-300 text-sm">
                Escaneie o QR Code com o Microsoft Authenticator
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl mb-6">
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto w-48 h-48"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Código de verificação
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="text-center text-2xl tracking-[0.5em] font-mono py-4"
                  autoFocus
                />
              </div>

              <Button
                onClick={confirm2FA}
                disabled={code.length !== 6 || loading2FA}
                className="w-full py-3 text-base"
              >
                {loading2FA ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    Validando...
                  </span>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function validatePassword(password) {
  return {
    length: password.length >= 8 && password.length <= 64,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
  }
}

function RuleItem({ valid, text }) {
  return (
    <div className="flex items-center gap-2">
      <i className={`text-base ${valid ? 'ri-checkbox-circle-fill text-green-400' : 'ri-close-circle-fill text-red-400'}`} />
      <span className={`text-xs ${valid ? 'text-green-300' : 'text-gray-400'}`}>{text}</span>
    </div>
  )
}

function PasswordStrength({ level }) {
  const strengthMap = {
    0: { width: '0%', color: '', text: '', textColor: '' },
    1: { width: '20%', color: 'bg-red-500', text: 'Muito fraca', textColor: 'text-red-400' },
    2: { width: '40%', color: 'bg-orange-500', text: 'Fraca', textColor: 'text-orange-400' },
    3: { width: '60%', color: 'bg-yellow-400', text: 'Média', textColor: 'text-yellow-400' },
    4: { width: '80%', color: 'bg-green-400', text: 'Boa', textColor: 'text-green-400' },
    5: { width: '100%', color: 'bg-green-600', text: 'Forte', textColor: 'text-green-400' },
  }

  const { width, color, text, textColor } = strengthMap[level] || strengthMap[0]

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Força da senha:</span>
        <span className={`text-xs font-medium ${textColor}`}>{text}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${color}`} style={{ width }} />
      </div>
    </div>
  )
}

export default Register