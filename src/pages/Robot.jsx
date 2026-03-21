import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Robot() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true }) // 🔥 aqui é o ponto correto
  }

  return (
    <div className="text-white p-10">
      <h1 className="text-2xl font-bold">Página Robot</h1>
      <p>Em construção...</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  )
}