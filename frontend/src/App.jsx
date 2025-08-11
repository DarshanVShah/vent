import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home, MessageSquare, Eye, Settings } from 'lucide-react'
import VentForm from './components/VentForm'
import VentFeed from './components/VentFeed'
import BrainrotMode from './components/BrainrotMode'
import Navigation from './components/Navigation'

function App() {
  const [isBrainrotMode, setIsBrainrotMode] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white text-shadow mb-4">
                  Vent
                </h1>
                <p className="text-xl text-white/90 text-shadow">
                  Scream into the void — and maybe hear an echo
                </p>
              </div>
              
              <VentForm />
              
              <div className="text-center">
                <button
                  onClick={() => setIsBrainrotMode(!isBrainrotMode)}
                  className="vent-button-secondary text-white bg-white/20 hover:bg-white/30 glass-effect"
                >
                  {isBrainrotMode ? 'Normal Mode' : '🧠 Brainrot Mode'}
                </button>
              </div>
              
              {isBrainrotMode ? <BrainrotMode /> : <VentFeed />}
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
