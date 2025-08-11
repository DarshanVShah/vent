# Vent 

A platform for individuals to anonymously vent.

## Core Concept

Vent gives users a space to anonymously post one emotional release per day. It's not therapy. It's not advice. It's just space to get something off your chest, be seen, and acknowledge others who feel the same rage, sadness, guilt, or absurdity.

## Key Features

### Daily Vent Limit
- **One anonymous vent per day** - Forces reflection, encourages thoughtfulness, prevents doomscrolling addiction
- IP-based tracking (hashed for privacy) ensures the daily limit

### Reactions System
Users can react to vents with:
- **Validation** ("you're totally right")
- **Asshole button** ("I might be the problem here")

### Minimalist Interface
- Clean, no clutter design
- Just a text box for venting
- After posting, you're taken to a feed of others' vents
- No usernames, no likes, no pressure — just vibes

## Architecture

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

## Privacy & Security

- **IP addresses are hashed** with a salt for anonymous tracking
- **No personal data stored** - completely anonymous
- **Rate limiting** prevents abuse
- **CORS enabled** for cross-origin requests
- **Helmet middleware** for security headers

## Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use production MongoDB instance
3. Deploy to your preferred hosting (Heroku, DigitalOcean, AWS, etc.)

### Frontend
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure API proxy is configured for production

## Future Enhancements

- **Emoji reactions** - Add more reaction types
- **Vent categories** - Group vents by emotion/topic
- **Anonymous chat** - Let users discuss specific vents
- **Vent streaks** - Track consecutive days of venting
- **Export data** - Let users download their vent history
- **Mobile app** - Native iOS/Android applications

---

