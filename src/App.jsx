import { useState } from 'react'
import Snowfall from 'react-snowfall'
import Login from './pages/Login'

function App() {
  const [snowOn, setSnowOn] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {snowOn && (
        <Snowfall 
          color="white"
          snowflakeCount={150}
        />
      )}
      <Login />
      <button
        onClick={() => setSnowOn(!snowOn)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full
          bg-white/10 backdrop-blur text-white shadow-lg hover:bg-white/20 transition z-20">
        {snowOn ? '❄️ Neve ON' : '❄️ Neve OFF'}
      </button>
    </div>
  )
}

export default App