// src/routes/medicineRoutes.js
import express from 'express';
import {
  addMedicine,
  getAllMedicines,
  searchMedicines,
  deleteMedicine
} from '../controllers/medicineController.js';

const router = express.Router();

router.post('/', addMedicine); // POST /api/medicines
router.get('/', getAllMedicines); // GET /api/medicines
router.get('/search', searchMedicines); // GET /api/medicines/search?keyword=Tablet
router.delete('/:id', deleteMedicine); // DELETE /api/medicines/:id

export default router;
