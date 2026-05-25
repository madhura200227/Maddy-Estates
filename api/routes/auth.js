import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maddyestates.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'maddy_luxury_2026';

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const token = jwt.sign(
        { email: adminEmail },
        process.env.JWT_SECRET || 'maddyestates_secret_2024',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        admin: {
          email: adminEmail,
          name: 'Executive Advisor'
        }
      });
    }

    return res.status(400).json({ error: 'Invalid premium credentials. Access denied.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
