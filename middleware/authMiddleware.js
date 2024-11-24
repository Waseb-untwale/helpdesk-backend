// Middleware to verify JWT token
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token:', token);  // Debugging: Check if the token is being sent
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);  // Log the error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


// Middleware to verify role (Customer, Agent, Admin)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};


module.exports = { authMiddleware, authorizeRoles };
