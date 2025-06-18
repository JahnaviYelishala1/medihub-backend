import express from 'express';
import {
  bookAppointment,
  getAllAppointments,
  getBookedSlots,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getAppointmentsByPatient,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/book', bookAppointment);
router.get('/', getAllAppointments);

// ✅ New: Route to fetch booked time slots for a doctor on a specific date
router.get('/booked-slots/:doctorId/:date', getBookedSlots);

// ✅ New: Route to fetch appointments for a specific doctor
router.get('/doctor/:doctorId', getAppointmentsByDoctor);
// ✅ Add this route
router.get('/patient/:patientId', getAppointmentsByPatient);
router.delete('/:id', deleteAppointment);



// ✅ New: Route to update appointment status
router.put('/:id/status', updateAppointmentStatus);

export default router;
