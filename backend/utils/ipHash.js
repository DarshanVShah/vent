const crypto = require('crypto');

// Create a hash of the IP address for anonymous tracking
function hashIP(ip) {
  // Add a salt to make it harder to reverse
  const salt = process.env.IP_SALT || 'vent-platform-salt';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

// Get IP from request (handles various proxy scenarios)
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.ip ||
         '127.0.0.1';
}

module.exports = {
  hashIP,
  getClientIP
};
