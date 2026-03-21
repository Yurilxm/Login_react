import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const isAuthenticated = !!user

  async function login(email, password, remember = false) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Erro ao fazer login' }
      }

      setUser(data)

      if (remember) {
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data))
      }

      return { success: true }
    } catch (error) {
      return { error: 'Erro de conexão com o servidor' }
    }
  }

  async function register(email, password) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Erro ao cadastrar' }
      }

      return { success: true }
    } catch (error) {
      return { error: 'Erro de conexão com o servidor' }
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}