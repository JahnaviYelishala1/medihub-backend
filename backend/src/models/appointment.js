import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 
import Doctor from '../models/doctor.js';

const Appointment = sequelize.define('Appointment', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  patientFirstName: {
    type: DataTypes.STRING
  },
  patientLastName: {
    type: DataTypes.STRING
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorFirstName: {
    type: DataTypes.STRING
  },
  doctorLastName: {
    type: DataTypes.STRING
  },
  experience: {
    type: DataTypes.STRING
  },
  appointmentCharges: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  timeSlot: {                        // ✅ Add this field
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  timestamps: true
});

export default Appointment;
