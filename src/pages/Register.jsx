import { useState } from 'react'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

function Register({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const passwordRules = validatePassword(password)
  const rulesCount = Object.values(passwordRules).filter(Boolean).length
  const isPasswordValid = rulesCount === 4

  function handleSubmit() {
    if (!email || !password) {
      toast.error('Preencha todos os campos')
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

    toast.success('Cadastro válido!')
  }

  return (
    <div className="relative w-full max-w-md backdrop-blur-sm bg-white/10 p-8 rounded-xl shadow-lg">

      {/* SETA → LOGIN */}
      <button
        onClick={onSwitch}
        className="absolute top-4 right-4 flex items-center gap-2 text-gray-400 hover:text-white transition transform hover:scale-110 group"
        title="Já tenho conta"
      >
        <span className="text-xs opacity-0 group-hover:opacity-100 transition">
          Já tenho conta
        </span>
        <i className="ri-login-box-line text-xl animate-pulse" />
      </button>

      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Criar conta
      </h1>

      <Input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="h-4" />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <i className={`ri-eye${showPassword ? '' : '-off'}-line text-xl`} />
        </button>
      </div>

      <PasswordStrength level={rulesCount} />

      <div className="mt-4 bg-black/20 rounded-lg p-4 text-sm text-white space-y-2">
        <p className="font-semibold mb-2">
          Sua senha precisa conter:
        </p>

        <RuleItem valid={passwordRules.length} text="8 a 64 caracteres" />
        <RuleItem valid={passwordRules.lowercase} text="1 letra minúscula" />
        <RuleItem valid={passwordRules.uppercase} text="1 letra maiúscula" />
        <RuleItem valid={passwordRules.number} text="1 número" />
      </div>

      <div className="h-6" />

      <Button onClick={handleSubmit} disabled={!isPasswordValid}>
        Criar conta
      </Button>
    </div>
  )
}

/* ===== FUNÇÕES AUXILIARES ===== */

function validatePassword(password) {
  return {
    length: password.length >= 8 && password.length <= 64,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  }
}

function RuleItem({ valid, text }) {
  return (
    <div className="flex items-center gap-2">
      <i
        className={`text-lg ${
          valid
            ? 'ri-checkbox-circle-fill text-green-400'
            : 'ri-close-circle-fill text-red-500'
        }`}
      />
      <span className={valid ? 'text-green-300' : 'text-gray-300'}>
        {text}
      </span>
    </div>
  )
}

function PasswordStrength({ level }) {
  const strengthMap = {
    0: { width: '0%', color: '', text: '' },
    1: { width: '25%', color: 'bg-red-500', text: 'Fraca' },
    2: { width: '50%', color: 'bg-orange-500', text: 'Média' },
    3: { width: '75%', color: 'bg-yellow-400', text: 'Boa' },
    4: { width: '100%', color: 'bg-green-500', text: 'Forte' },
  }

  const { width, color, text } = strengthMap[level]

  return (
    <div className="mt-3">
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width }}
        />
      </div>

      {text && (
        <p className="mt-1 text-xs font-semibold text-gray-300">
          Força da senha: <span className="text-white">{text}</span>
        </p>
      )}
    </div>
  )
}

export default Register