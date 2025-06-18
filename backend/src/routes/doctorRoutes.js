import express from 'express';
import upload from '../utils/multer.js';
import { registerDoctor, loginDoctor, getAllDoctors } from '../controllers/doctorController.js';
import Doctor from '../models/doctor.js';


const router = express.Router();

router.post('/register', upload.single('docAvatar'), registerDoctor);
router.post('/login', loginDoctor);



router.get('/', getAllDoctors);

export default router;
