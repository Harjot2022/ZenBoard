import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401); // No token? Get out.

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey123', (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token? Forbidden.
    req.user = user;
    next();
  });
};