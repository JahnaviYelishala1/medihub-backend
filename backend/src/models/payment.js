// models/payment.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; // if user relation is needed

const Payment = sequelize.define('Payment', {
  razorpay_order_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  razorpay_payment_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpay_signature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  items: {
    type: DataTypes.TEXT, // You’ll store JSON.stringify(cartItems)
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('created', 'paid', 'failed'),
    defaultValue: 'created',
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

export default Payment;
