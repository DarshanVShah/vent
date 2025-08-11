import React, { useState, useEffect } from 'react'
import { Send, AlertCircle, CheckCircle } from 'lucide-react'
import { ventApi } from '../services/api'

function VentForm() {
  const [content, setContent] = useState('')
  const [canPost, setCanPost] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    checkCanPost()
  }, [])

  const checkCanPost = async () => {
    try {
      const response = await ventApi.checkCanPost()
      setCanPost(response.canPost)
      
      if (!response.canPost) {
        setMessage('You\'ve already vented today. Come back tomorrow!')
        setMessageType('info')
      }
    } catch (error) {
      console.error('Error checking post eligibility:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim() || !canPost) return
    
    setIsSubmitting(true)
    setMessage('')
    
    try {
      await ventApi.createVent(content.trim())
      setContent('')
      setCanPost(false)
      setMessage('Vent posted successfully!')
      setMessageType('success')
      
      // Refresh the page to show the new vent
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error posting vent:', error)
      setMessage(error.response?.data?.error || 'Failed to post vent')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canPost) {
    return (
      <div className="vent-card text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          You've already vented today
        </h3>
        <p className="text-gray-600">
          Come back tomorrow for another vent session. Take care of yourself! 💙
        </p>
      </div>
    )
  }

  return (
    <div className="vent-card">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        What's on your mind?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="vent-textarea"
          placeholder="Type your vent here... (max 1000 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {content.length}/1000 characters
          </span>
          
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="vent-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting...' : 'Vent'}</span>
          </button>
        </div>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : messageType === 'error'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : messageType === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}

export default VentForm
