import Medicine from '../models/medicine.js';

// Add new medicine
export const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// View all medicines (stock)
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).json({ success: true, medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update medicine stock
export const updateMedicineStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    medicine.stock = stock;
    await medicine.save();

    res.status(200).json({ success: true, message: 'Stock updated', medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    await medicine.destroy();
    res.status(200).json({ success: true, message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
