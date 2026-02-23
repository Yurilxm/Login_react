import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'


function Login() {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="w-full max-w-md backdrop-blur-sm bg-white/10 p-8 rounded-xl shadow-lg z-10">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
                Login
            </h1>
            <Input
                type="email"
                placeholder="Digite seu email"
            />

            <div className="h-4" />

            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    {showPassword ? <i className="ri-eye-line text-xl" /> : <i className="ri-eye-off-line text-xl"/>}
                </button>
            </div>

            <div className="h-6" />

            <Button>
                Entrar
            </Button>
        </div>
    )
}

export default Login