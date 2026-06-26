// routes/webhook.js
const express = require('express');
const Stripe = require('stripe');

const sendResponse = require('../utils/sendResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Subscription = require('../schemas/subscriptionSchema');
const { default: User } = require('../schemas/userSchema');
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }), // ⚠️ must be raw body
  asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Webhook error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    // ── Payment সফল ──────────────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { planId, priceId, userId, userEmail } = session.metadata;

      // 'seeker-pro' → 'pro' | 'recruiter-enterprise' → 'enterprise'
      const plan = planId.split('-')[1];

      // 1. Subscription save
      await Subscription.findOneAndUpdate(
        { userId },
        {
          userId,
          userEmail,
          planId,
          priceId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: 'active',
        },
        { upsert: true, new: true }
      );

      // 2. User plan update: free → pro/enterprise
      await User.findByIdAndUpdate(userId, {
        plan,
        updatedAt: new Date(),
      });

      // console.log(`✅ ${userEmail}: free → ${plan}`);
    }

    // ── Subscription cancel ───────────────────────────
    if (event.type === 'customer.subscription.deleted') {
      const sub = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: event.data.object.id },
        { status: 'cancelled' },
        { new: true }
      );

      if (sub?.userId) {
        await User.findByIdAndUpdate(sub.userId, {
          plan: 'free',
          updatedAt: new Date(),
        });
        console.log(`🔄 ${sub.userEmail}: downgraded → free`);
      }
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'Webhook received',
      data: {
        received: true,
      },
    });
  })
);

module.exports = router;
