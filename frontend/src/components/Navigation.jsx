import React from 'react'
import { MessageSquare } from 'lucide-react'

function Navigation() {
  return (
    <nav className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Vent</span>
          </div>
          
          <div className="text-sm text-white/70">
            Anonymous • One per day
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
