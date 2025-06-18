import express from 'express';
import razorpay from '../config/razorpay.js';
import Payment from '../models/payment.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { amount, items, userId } = req.body;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    });

    // Save to DB
    const payment = await Payment.create({
      razorpay_order_id: razorpayOrder.id,
      amount,
      items: JSON.stringify(items),
      userId,
      status: 'created'
    });

    res.json({ orderId: razorpayOrder.id, amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment order creation failed' });
  }
});

router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    await Payment.update(
      {
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid'
      },
      { where: { razorpay_order_id } }
    );

    res.json({ success: true });
  } else {
    await Payment.update(
      { status: 'failed' },
      { where: { razorpay_order_id } }
    );

    res.status(400).json({ success: false, error: 'Invalid signature' });
  }
});