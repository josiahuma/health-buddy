const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'heavenly';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Verified Token Payload:', verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token Verification Error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
