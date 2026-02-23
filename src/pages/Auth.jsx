import { useState } from 'react'
import Login from './Login'
import Register from './Register'

function Auth() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="relative w-full max-w-md h-[520px] perspective">
      
      <div
        className={`relative w-full h-full transition-transform duration-800 ease-in-out transform-style-preserve-3d
          ${isLogin ? 'rotate-y-180' : ''}`}
      >
        <div className="backface-hidden">
          <Login onSwitch={() => setIsLogin(true)} />
        </div>

        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <Register onSwitch={() => setIsLogin(false)} />
        </div>

      </div>
    </div>
  )
}

export default Auth