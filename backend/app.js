import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import sequelize from './src/config/db.js'; 
import protectedRoutes from './src/routes/protectedRoute.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import path from 'path';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import medicineRoutes from './src/routes/medicineRoutes.js';
import cors from 'cors';
import Payment from './src/models/payment.js';
import contactRoutes from './src/routes/contactRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3306;
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/payments', Payment);
app.use('/api/contact', contactRoutes);

// Sync DB and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('🗄️ All models synced.');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
