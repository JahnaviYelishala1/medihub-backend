// src/controllers/medicineController.js
import Medicine from '../models/medicine.js';

// ➕ Add Medicine
export const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, medicine });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📋 Get All Medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Search by Category or Name
export const searchMedicines = async (req, res) => {
  const { keyword } = req.query;

  try {
    const medicines = await Medicine.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
    res.json({ success: true, medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Delete Medicine
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findByPk(id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Not found' });

    await medicine.destroy();
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
