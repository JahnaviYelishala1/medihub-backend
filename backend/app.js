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
import Admin from './src/models/admin.js';
import adminRoutes from './src/routes/adminRoutes.js';
import bcrypt from 'bcrypt';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3306;
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/payments', Payment);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

const createAdminIfNotExists = async () => {
  const existingAdmin = await Admin.findOne({ where: { email: 'admin@medihub.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ email: 'admin@medihub.com', password: hashedPassword });
    console.log('✅ Admin user created');
  } else {
    console.log('👤 Admin already exists');
  }
};


// Sync DB and start server
sequelize.sync({ alter: true }).then(async () => {
  console.log('🗄️ All models synced.');
  await createAdminIfNotExists();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
