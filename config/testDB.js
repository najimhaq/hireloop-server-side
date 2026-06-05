// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//     console.log('DB name:', conn.connection.name);
//     console.log('Host:', conn.connection.host);
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

//=============

// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit process with failure
//   }
// };
// module.exports = connectDB;
