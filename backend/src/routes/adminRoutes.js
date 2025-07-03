// src/routes/adminRoutes.js
import express from 'express';
import Admin from '../models/admin.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // You can generate JWT or session here if needed
    res.status(200).json({ message: 'Login successful', adminId: admin.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
