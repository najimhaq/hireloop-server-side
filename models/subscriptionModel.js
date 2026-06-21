// hirloop-backend/models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    planId: { type: String, required: true },
    priceId: { type: String, required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due'],
      default: 'active',
    },
  },
  { timestamps: true, collection: 'subscriptions' }
);

// ✅ Schema আর Model একই file এ রাখো
const Subscription =
  mongoose.models.Subscription ||
  mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
