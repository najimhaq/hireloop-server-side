// lib/auth.js 
const { betterAuth } = require('better-auth');
const { MongoClient } = require('mongodb');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('hireloop');

const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        default: 'seeker',
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

module.exports = { auth };
