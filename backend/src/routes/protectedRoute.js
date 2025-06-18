// backend/src/routes/protectedRoute.js
import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Example protected route (any logged-in user)
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}, you are authenticated.` });
});

// Example role-based protected route (only Admins)
router.get('/admin', authenticate, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.id}, you have access.` });
});

export default router;
