import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react'
import { ventApi } from '../services/api'

function BrainrotMode() {
  const [vents, setVents] = useState([])
  const [currentVentIndex, setCurrentVentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const speechRef = useRef(null)

  // Background video URLs (subway surfer style)
  const backgroundVideos = [
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Placeholder
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', // Placeholder
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'  // Placeholder
  ]

  useEffect(() => {
    loadVents()
  }, [])

  useEffect(() => {
    if (vents.length > 0 && isPlaying) {
      speakCurrentVent()
    }
  }, [currentVentIndex, isPlaying])

  const loadVents = async () => {
    try {
      setLoading(true)
      const response = await ventApi.getVents(1, 50) // Load more vents for brainrot mode
      setVents(response.vents)
    } catch (error) {
      console.error('Error loading vents:', error)
    } finally {
      setLoading(false)
    }
  }

  const speakCurrentVent = () => {
    if (speechRef.current) {
      speechRef.current.cancel()
    }

    if ('speechSynthesis' in window && vents[currentVentIndex]) {
      const utterance = new SpeechSynthesisUtterance(vents[currentVentIndex].content)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = isMuted ? 0 : 1
      
      utterance.onend = () => {
        // Auto-advance to next vent after speaking
        setTimeout(() => {
          nextVent()
        }, 1000)
      }
      
      speechRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (speechRef.current) {
        speechSynthesis.pause()
      }
    } else {
      setIsPlaying(true)
      if (speechRef.current) {
        speechSynthesis.resume()
      } else {
        speakCurrentVent()
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (speechRef.current) {
      speechRef.current.volume = !isMuted ? 0 : 1
    }
  }

  const nextVent = () => {
    setCurrentVentIndex((prev) => (prev + 1) % vents.length)
  }

  const previousVent = () => {
    setCurrentVentIndex((prev) => (prev - 1 + vents.length) % vents.length)
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  if (loading) {
    return (
      <div className="vent-card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vent-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading brainrot mode...</p>
      </div>
    )
  }

  if (vents.length === 0) {
    return (
      <div className="vent-card text-center">
        <p className="text-gray-600">No vents available for brainrot mode</p>
      </div>
    )
  }

  const currentVent = vents[currentVentIndex]
  const currentVideo = backgroundVideos[currentVentIndex % backgroundVideos.length]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white text-shadow mb-2">
          🧠 Brainrot Mode
        </h2>
        <p className="text-white/80 text-shadow">
          Scroll vents while watching subway surfer clips with text-to-speech
        </p>
      </div>

      <div className="vent-card p-0 overflow-hidden">
        {/* Background Video */}
        <div className="relative h-64 bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={currentVideo}
            loop
            muted
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration)
              }
            }}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlayPause}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={previousVent}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={nextVent}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Vent Content Overlay */}
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-500">
              Vent {currentVentIndex + 1} of {vents.length}
            </div>
            
            <div className="text-2xl font-bold text-gray-800 leading-relaxed">
              "{currentVent.content}"
            </div>
            
            <div className="text-sm text-gray-500">
              {new Date(currentVent.createdAt).toLocaleDateString()}
            </div>
            
            {/* Reaction Summary */}
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="text-green-600">
                👍 {currentVent.reactions?.validations || 0} validations
              </span>
              <span className="text-red-600">
                😬 {currentVent.reactions?.assholes || 0} assholes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Info */}
      <div className="text-center text-white/80 text-sm">
        <p>Use the controls above to navigate between vents</p>
        <p>Text-to-speech will automatically read each vent aloud</p>
      </div>
    </div>
  )
}

export default BrainrotMode
