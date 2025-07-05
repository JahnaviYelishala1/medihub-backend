import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import sequelize from './src/config/db.js'; 
import protectedRoutes from './src/routes/protectedRoute.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import path from 'path';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import cors from 'cors';
import contactRoutes from './src/routes/contactRoutes.js';
import Admin from './src/models/admin.js';
import adminRoutes from './src/routes/adminRoutes.js';
import medicineRoutes from './src/routes/medicineRoutes.js';
import Razorpay from 'razorpay';
import bcrypt from 'bcrypt';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3306;
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
const corsOptions = {
  origin: 'https://medihub-eta.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/payment/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/medicines', medicineRoutes);


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
sequelize.sync({ alter: true  }).then(async () => {
  console.log('🗄️ All models synced.');
  await createAdminIfNotExists();
  app.listen(PORT, () => {
    console.log(`Server running`);
  });
});
