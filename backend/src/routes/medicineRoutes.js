import express from 'express';
import {
  addMedicine,
  getAllMedicines,
  updateMedicineStock,
  deleteMedicine
} from '../controllers/medicineController.js';

const router = express.Router();

// Add medicine
router.post('/', addMedicine);

// View all medicines
router.get('/', getAllMedicines);

// Update stock
router.put('/:id/stock', updateMedicineStock);

// Delete medicine
router.delete('/:id', deleteMedicine);

export default router;
