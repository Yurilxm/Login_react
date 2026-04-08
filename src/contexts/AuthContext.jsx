import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [userData, setUserData] = useState(null)
  const isAuthenticated = !!user?.access

  // 🔐 LOGIN
  async function login(email, password, remember = false, twoFactorCode) {
    try {
      const payload = {
        username: email,
        password,
        two_factor_code: twoFactorCode,
      }

      const { data } = await api.post('/token/', payload)

      const authData = {
        access: data.access,
        refresh: data.refresh,
      }

      setUser(authData)

      if (remember) {
        localStorage.setItem('user', JSON.stringify(authData))
      } else {
        sessionStorage.setItem('user', JSON.stringify(authData))
      }

      await fetchUser(authData.access)
      return { success: true }
    } catch (error) {
      const errorData = error.response?.data
      
      // 🎯 Verifica se é erro de conta inativa
      if (errorData?.non_field_errors) {
        const errors = errorData.non_field_errors
        if (Array.isArray(errors) && errors.some(e => e.includes('aguarda aprovação'))) {
          return { 
            error: 'account_inactive',
            message: 'Este é seu primeiro acesso! Aguarde a aprovação do administrador. Você receberá um email quando sua conta for ativada.'
          }
        }
      }
      
      const errorMessage = extractErrorMessage(errorData)
      return { error: errorMessage ?? 'Erro de conexão com o servidor' }
    }
  }

  // 📝 REGISTER
  async function register(email, password, firstName, lastName, username) {
    try {
      const payload = {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }

      const { data } = await api.post('/signup/', payload)

      return {
        success: true,
        qrCode: data.qr_code,
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error.response?.data)
      return { error: errorMessage ?? 'Erro de conexão com o servidor' }
    }
  }

  // VERIFICAÇÃO DE 2FA
  async function verify2FA(email, code) {
    try {
      await api.post('/2fa/verify/', {
        email,
        code
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Erro ao validar 2FA'
      
      return { error: errorMessage }
    }
  }

  // 🛠 Extrai mensagem de erro
  function extractErrorMessage(data) {
    if (!data) return null
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    if (data.error) return data.error
    if (data.message) return data.message

    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) return data[key][0]
      if (typeof data[key] === 'string') return data[key]
    }

    return JSON.stringify(data)
  }

  // 👤 BUSCAR USUÁRIO LOGADO
  async function fetchUser(token) {
    try {
      const { data } = await api.get('/signup/me/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData(data)
    } catch {
      logout()
    }
  }

  // 🔄 REFRESH TOKEN
  async function refreshToken() {
    try {
      const { data } = await api.post('/token/refresh/', {
        refresh: user?.refresh,
      })

      const updatedUser = { ...user, access: data.access }
      setUser(updatedUser)
      
      // Atualiza no storage correto
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return data.access
    } catch {
      logout()
    }
  }

  // 🚪 LOGOUT
  function logout() {
    setUser(null)
    setUserData(null)
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  // 🔁 AUTO LOGIN
  useEffect(() => {
    if (user?.access) {
      fetchUser(user.access)
    }
  }, [])

  // 🧠 Requisições autenticadas
  async function authFetch(url, options = {}) {
    const { method = 'get', data, headers = {}, ...rest } = options

    const config = {
      headers: { ...headers, Authorization: `Bearer ${user?.access}` },
      ...rest,
    }

    try {
      return await api({ method, url, data, ...config })
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshToken()
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`
          return await api({ method, url, data, ...config })
        }
      }
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      isAuthenticated, 
      login, 
      register, 
      verify2FA, 
      logout, 
      authFetch 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}