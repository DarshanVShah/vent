# Vent - Anonymous Venting Platform

A platform for individuals to anonymously vent — get some anger out, one vent a day.

## 🧠 Core Concept

Vent gives users a space to anonymously post one emotional release per day. It's not therapy. It's not advice. It's just space to get something off your chest, be seen, and acknowledge others who feel the same rage, sadness, guilt, or absurdity.

## 🌪️ Key Features

### Daily Vent Limit
- **One anonymous vent per day** - Forces reflection, encourages thoughtfulness, prevents doomscrolling addiction
- IP-based tracking (hashed for privacy) ensures the daily limit

### Reactions System
Users can react to vents with:
- **Validation** ("you're totally right") 👍
- **Asshole button** ("I might be the problem here") 😬

### Minimalist Interface
- Clean, no clutter design
- Just a text box for venting
- After posting, you're taken to a feed of others' vents
- No usernames, no likes, no pressure — just vibes

### 🧠 Brainrot Mode (Optional Toggle)
For chaotic self-soothing:
- Scroll vents while watching Subway Surfers, Minecraft parkour, or ASMR slime in the background
- AI or TTS voice reads the vent aloud
- Great for TikTok-era attention spans

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your MongoDB connection string and other settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/vent-platform
   PORT=5000
   IP_SALT=your-super-secret-salt-here
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## 🏗️ Architecture

### Backend
- **Node.js/Express** - RESTful API server
- **MongoDB/Mongoose** - Database and ODM
- **Rate limiting** - Prevents abuse
- **IP hashing** - Anonymous user tracking
- **Helmet** - Security middleware

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Database Models
- **Vent** - Stores anonymous vent content with daily limits
- **Reaction** - Tracks user interactions (validation/asshole)

## 🔒 Privacy & Security

- **IP addresses are hashed** with a salt for anonymous tracking
- **No personal data stored** - completely anonymous
- **Rate limiting** prevents abuse
- **CORS enabled** for cross-origin requests
- **Helmet middleware** for security headers

## 🎯 API Endpoints

### Vents
- `GET /api/vents` - Get all vents (paginated)
- `POST /api/vents` - Create a new vent
- `GET /api/vents/can-post` - Check if user can post today
- `GET /api/vents/today` - Get user's vent for today
- `GET /api/vents/:id` - Get specific vent

### Reactions
- `POST /api/reactions/:ventId` - React to a vent
- `GET /api/reactions/:ventId/stats` - Get reaction stats
- `GET /api/reactions/:ventId/user` - Get user's reaction

## 🎨 Customization

### Styling
- Edit `frontend/src/index.css` for global styles
- Modify `frontend/tailwind.config.js` for theme customization
- Component-specific styles in each component file

### Brainrot Mode Videos
- Replace placeholder video URLs in `BrainrotMode.jsx`
- Add your own subway surfer clips or other background content
- Customize text-to-speech settings

## 🚀 Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use production MongoDB instance
3. Deploy to your preferred hosting (Heroku, DigitalOcean, AWS, etc.)

### Frontend
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure API proxy is configured for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for your own venting platform!

## 💡 Future Enhancements

- **Emoji reactions** - Add more reaction types
- **Vent categories** - Group vents by emotion/topic
- **Anonymous chat** - Let users discuss specific vents
- **Vent streaks** - Track consecutive days of venting
- **Export data** - Let users download their vent history
- **Mobile app** - Native iOS/Android applications

---

**Remember**: This is a space for anonymous emotional expression. Be kind, be respectful, and take care of yourself. 💙
