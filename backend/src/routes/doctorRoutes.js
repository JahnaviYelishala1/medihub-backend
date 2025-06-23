import express from 'express';
import { registerDoctor, loginDoctor, getAllDoctors } from '../controllers/doctorController.js';
import Doctor from '../models/doctor.js';


const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);



router.get('/', getAllDoctors);

export default router;
