import { useState } from 'react'
import Snowfall from 'react-snowfall'
import { Toaster } from 'react-hot-toast'
import Auth from './pages/Auth'

function App() {
  const [snowOn, setSnowOn] = useState(true)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {snowOn && (
        <Snowfall 
          color="white"
          snowflakeCount={150}
          className="absolute inset-0 pointer-events-none z-0"
        />
      )}
      <div className="relative z-10 w-full flex justify-center">
        <Auth />
      </div>
      <button
        onClick={() => setSnowOn(!snowOn)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full
          bg-white/10 backdrop-blur text-white shadow-lg hover:bg-white/20 transition z-20">
        {snowOn ? '❄️ Neve ON' : '❄️ Neve OFF'}
      </button>
      <Toaster position="top-right" />
    </div>
  )
}

export default App