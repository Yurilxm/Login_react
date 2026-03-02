import { createContext, useContext, useState } from 'react'
import { users } from '../mocks/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const isAuthenticated = !!user

  console.log('USER AO INICIAR:', user)
  console.log('IS AUTH:', isAuthenticated)

  function login(email, password, remember = false) {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (!foundUser) {
      return { error: 'Email ou senha inválidos' }
    }

    setUser(foundUser)

    if (remember) {
      localStorage.setItem('user', JSON.stringify(foundUser))
    } else {
      sessionStorage.setItem('user', JSON.stringify(foundUser))
    }

    return { success: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}