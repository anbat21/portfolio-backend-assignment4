var jwt = require('jsonwebtoken');

// Simple JWT authentication middleware
// Expects header: Authorization: Bearer <token>
module.exports = function (req, res, next) {
  var authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  var parts = authHeader.split(' ');
  var token = parts.length === 2 ? parts[1] : parts[0];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_change_me', function (err, decoded) {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // Attach decoded payload (e.g., user id, email) to request
    req.user = decoded;
    next();
  });
};
