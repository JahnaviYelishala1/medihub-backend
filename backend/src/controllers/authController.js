import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import sendOTPEmail from '../utils/emailService.js';
import Doctor from '../models/doctor.js';
import Admin from '../models/admin.js'; 
import bcrypt from 'bcrypt';

const otpStore = {}; 

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    if (role === 'Patient') {
      user = await User.findOne({ where: { email, role } });
    } else if (role === 'Doctor') {
      user = await Doctor.findOne({ where: { email } });
    } else if (role === 'Admin') {
      user = await Admin.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    // Handle password comparison manually if Admin doesn't use `comparePassword` method
    let isMatch = false;
    if (role === 'Admin' || role === 'Doctor') {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = await user.comparePassword(password); // assuming User model has method
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[email] = { otp, expiresAt };


    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP sent to this email' });
  }

  const { otp: storedOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP verified successfully
  delete otpStore[email]; // clean up
  res.status(200).json({ success: true, message: 'OTP verified successfully' });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};