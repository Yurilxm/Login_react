import { useState } from 'react'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

function Login({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        title="Criar conta"
      >
        <i className="ri-user-add-line text-xl" />
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <i className={`ri-eye${showPassword ? '' : '-off'}-line text-xl`} />
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