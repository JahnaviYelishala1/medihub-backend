import Doctor from '../models/doctor.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

export const registerDoctor = async (req, res) => {
  try {
    console.log('REQ.FILE:', req.file);
    console.log('REQ.BODY:', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    // Convert buffer to readable stream and upload to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'medicore/doctors' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadedImage = await streamUpload(req);

    const doctor = await Doctor.create({
      ...req.body,
      specializations: JSON.parse(req.body.specializations),
      qualifications: JSON.parse(req.body.qualifications),
      availableDays: JSON.parse(req.body.availableDays),
      languagesKnown: JSON.parse(req.body.languagesKnown),
      docAvatar: uploadedImage.secure_url
    });

    const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES || '7d',
    });

    res.status(201).json({ success: true, doctor, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES || '7d'
    });

    res.status(200).json({ success: true, doctor, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    console.log("DOCTORS:", doctors);  // Add this
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error in getAllDoctors:', err);
    res.status(500).json({ message: 'Failed to fetch doctors', error: err.message });
  }
};

