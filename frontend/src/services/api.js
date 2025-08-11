import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Vent API endpoints
export const ventApi = {
  // Get all vents with pagination
  getVents: (page = 1, limit = 20) => {
    return api.get('/vents', { params: { page, limit } })
  },

  // Get a specific vent by ID
  getVent: (id) => {
    return api.get(`/vents/${id}`)
  },

  // Create a new vent
  createVent: (content) => {
    return api.post('/vents', { content })
  },

  // Check if user can post today
  checkCanPost: () => {
    return api.get('/vents/can-post')
  },

  // Get user's vent for today
  getTodayVent: () => {
    return api.get('/vents/today')
  },
}

// Reaction API endpoints
export const reactionApi = {
  // React to a vent (validation or asshole)
  reactToVent: (ventId, reactionType) => {
    return api.post(`/reactions/${ventId}`, { reactionType })
  },

  // Get reaction stats for a vent
  getVentStats: (ventId) => {
    return api.get(`/reactions/${ventId}/stats`)
  },

  // Get user's reaction to a specific vent
  getUserReaction: (ventId) => {
    return api.get(`/reactions/${ventId}/user`)
  },
}

// Health check
export const healthCheck = () => {
  return api.get('/health')
}

export default api
