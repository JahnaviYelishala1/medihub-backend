import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js'; 

const Doctor = sequelize.define('Doctor', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 255] }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 255] }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      len: [10, 10],
      isNumeric: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  pincode: { type: DataTypes.STRING, allowNull: true },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false
  },
  departmentName: { type: DataTypes.STRING, allowNull: false },
  departmentDescription: { type: DataTypes.TEXT, allowNull: false },
  specializations: {
    type: DataTypes.JSON, // Array of objects [{name, description}]
    allowNull: false
  },
  qualifications: {
    type: DataTypes.JSON, // Array of strings
    allowNull: false
  },
  experience: { type: DataTypes.STRING, allowNull: false },
  availableDays: {
    type: DataTypes.JSON, // Example: ["Monday", "Tuesday"]
    allowNull: false
  },
  availableHours: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Patient', 'Doctor'),
    allowNull: false
  },
  languagesKnown: {
    type: DataTypes.JSON, // Array of strings
    allowNull: false
  },
  appointmentCharges: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (doctor) => {
      doctor.password = await bcrypt.hash(doctor.password, 10);
    }
  }
});

// Method to compare password
Doctor.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default Doctor;
