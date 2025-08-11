import React, { useState, useEffect } from 'react'
import { ThumbsUp, UserX, Clock, MessageSquare } from 'lucide-react'
import { ventApi, reactionApi } from '../services/api'
import VentCard from './VentCard'

function VentFeed() {
  const [vents, setVents] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVents()
  }, [])

  const loadVents = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await ventApi.getVents(pageNum)
      
      if (pageNum === 1) {
        setVents(response.vents)
      } else {
        setVents(prev => [...prev, ...response.vents])
      }
      
      setHasMore(response.pagination.hasMore)
      setPage(response.pagination.current)
    } catch (error) {
      console.error('Error loading vents:', error)
      setError('Failed to load vents')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadVents(page + 1)
    }
  }

  const handleReaction = async (ventId, reactionType) => {
    try {
      const response = await reactionApi.reactToVent(ventId, reactionType)
      
      // Update the vent's reaction counts
      setVents(prev => prev.map(vent => {
        if (vent._id === ventId) {
          return {
            ...vent,
            reactions: response.reactions
          }
        }
        return vent
      }))
    } catch (error) {
      console.error('Error reacting to vent:', error)
    }
  }

  if (loading && vents.length === 0) {
    return (
      <div className="vent-card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vent-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vents...</p>
      </div>
    )
  }

  if (error && vents.length === 0) {
    return (
      <div className="vent-card text-center">
        <MessageSquare className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Failed to load vents
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => loadVents()}
          className="vent-button-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (vents.length === 0) {
    return (
      <div className="vent-card text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No vents yet
        </h3>
        <p className="text-gray-600">
          Be the first to vent! Your anonymous thoughts are welcome here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white text-shadow mb-2">
          Recent Vents
        </h2>
        <p className="text-white/80 text-shadow">
          Read what others are thinking about
        </p>
      </div>
      
      <div className="space-y-4">
        {vents.map((vent) => (
          <VentCard
            key={vent._id}
            vent={vent}
            onReaction={handleReaction}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="vent-button-secondary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Vents'}
          </button>
        </div>
      )}
    </div>
  )
}

export default VentFeed
