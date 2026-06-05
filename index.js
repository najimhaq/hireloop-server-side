const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const router = require('./routes/job.route');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//home - route
app.get('/', (req, res) => {
  res.send('Running Home');
});

//all routes
app.use(router);

//connect Database
connectDB();

//error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
