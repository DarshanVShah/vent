import React, { useState, useEffect } from 'react'
import { ThumbsUp, UserX, Clock, MessageSquare } from 'lucide-react'
import { reactionApi } from '../services/api'

function VentCard({ vent, onReaction }) {
  const [userReaction, setUserReaction] = useState(null)
  const [isReacting, setIsReacting] = useState(false)

  useEffect(() => {
    loadUserReaction()
  }, [vent._id])

  const loadUserReaction = async () => {
    try {
      const response = await reactionApi.getUserReaction(vent._id)
      setUserReaction(response.reaction)
    } catch (error) {
      console.error('Error loading user reaction:', error)
    }
  }

  const handleReaction = async (reactionType) => {
    if (isReacting) return
    
    setIsReacting(true)
    try {
      await onReaction(vent._id, reactionType)
      setUserReaction(reactionType)
    } finally {
      setIsReacting(false)
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const ventTime = new Date(timestamp)
    const diffMs = now - ventTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return ventTime.toLocaleDateString()
  }

  return (
    <div className="vent-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="space-y-4">
        {/* Vent content */}
        <div className="space-y-3">
          <p className="text-gray-800 text-lg leading-relaxed">
            {vent.content}
          </p>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(vent.createdAt)}
          </div>
        </div>

        {/* Reaction buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            {/* Validation button */}
            <button
              onClick={() => handleReaction('validation')}
              disabled={isReacting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                userReaction === 'validation'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-medium">
                You're right ({vent.reactions?.validations || 0})
              </span>
            </button>

            {/* Asshole button */}
            <button
              onClick={() => handleReaction('asshole')}
              disabled={isReacting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                userReaction === 'asshole'
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span className="font-medium">
                I'm the problem ({vent.reactions?.assholes || 0})
              </span>
            </button>
          </div>

          {/* Total reactions */}
          <div className="text-sm text-gray-500">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            {(vent.reactions?.validations || 0) + (vent.reactions?.assholes || 0)} reactions
          </div>
        </div>
      </div>
    </div>
  )
}

export default VentCard
