// models/medicine.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Medicine = sequelize.define('Medicine', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3],
      notNull: { msg: 'Medicine Name is required' },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      notNull: { msg: 'Price is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10],
      notNull: { msg: 'Description is required' },
    },
  },
  category: {
    type: DataTypes.ENUM,
    values: ['Tablet', 'Syrup', 'Injection', 'Drops', 'Cream', 'Powder', 'Lotion', 'Inhaler'],
    allowNull: false,
    validate: {
      notNull: { msg: 'Category is required' },
    },
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Manufacturer is required' },
    },
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: { msg: 'Expiry Date is required' },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0,
      notNull: { msg: 'Stock is required' },
    },
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
      notNull: { msg: 'Discount is required' },
    },
  },
}, {
  timestamps: true,
});

export default Medicine;
