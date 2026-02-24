import { useState } from 'react'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

function Login({ onSwitch, onForgotPassword }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

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

    toast.success('Login válido!')
  }

  return (
    <div className="relative w-full max-w-md backdrop-blur-sm bg-white/10 p-8 rounded-xl shadow-lg">

      {/* SETA → CRIAR CONTA */}
      <button
        onClick={onSwitch}
        className="absolute top-4 right-4 flex items-center gap-2 text-gray-400 hover:text-white transition transform hover:scale-110 group"
        title="Criar conta"
      >
        <span className="text-xs opacity-0 group-hover:opacity-100 transition">
          Criar conta
        </span>
        <i className="ri-user-add-line text-xl animate-pulse" />
      </button>

      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Login
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
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          <i className={`ri-eye${showPassword ? '' : '-off'}-line text-xl`} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-blue-500 w-4 h-4"
            />
            Lembrar de mim
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Esqueci minha senha
          </button>
        </div>

      <div className="h-6" />

      <Button onClick={handleSubmit}>
        Entrar
      </Button>
    </div>
  )
}

export default Login