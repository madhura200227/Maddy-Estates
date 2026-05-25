import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No security token provided. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Security token is empty. Authorization denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'maddyestates_secret_2024');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session expired or security token invalid. Access denied.' });
  }
};
