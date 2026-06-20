const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');

// Plan → Stripe Price ID mapping
const PRICE_IDS = {
  'seeker-pro': 'price_seekerpro_xxx',
  'seeker-enterprise': 'price_seekerente_xxx',
  'recruiter-pro': 'price_recruiterpro_xxx',
  'recruiter-enterprise': 'price_recruiterente_xxx',
};

// Plan ID → user.plan value mapping
const PLAN_MAP = {
  price_seekerpro_xxx: 'pro',
  price_seekerente_xxx: 'enterprise',
  price_recruiterpro_xxx: 'pro',
  price_recruiterente_xxx: 'enterprise',
};

// POST /api/stripe/checkout
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  const priceId = PRICE_IDS[planId];
  if (!priceId) {
    return res.status(400).json({ success: false, message: 'Invalid plan' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    metadata: { userId }, // webhook এ দরকার হবে
    subscription_data: {
      metadata: { userId },
    },
  });

  res.status(200).json({ success: true, url: session.url });
});

// POST /api/stripe/webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body — important!
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment successful → update user plan
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const priceId =
      session.display_items?.[0]?.price?.id ||
      (await stripe.checkout.sessions.listLineItems(session.id)).data[0]?.price
        ?.id;

    const newPlan = PLAN_MAP[priceId];

    if (userId && newPlan) {
      await User.findByIdAndUpdate(userId, {
        plan: newPlan,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      });
    }
  }

  // Subscription cancelled → downgrade to free
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const userId = subscription.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: 'free' });
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
