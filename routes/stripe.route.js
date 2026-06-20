const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
} = require('../controllers/stripe.controller');
const { protect } = require('../middleware/authMiddleware');

// ⚠️ Webhook MUST use raw body — এই route টা express.json() এর আগে register করো
router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.post('/stripe/checkout', protect, createCheckoutSession);

module.exports = router;
