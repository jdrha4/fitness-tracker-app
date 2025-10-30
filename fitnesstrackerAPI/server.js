
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());             // Allows cross-origin requests (important for React frontend)
app.use(express.json());     // Parses JSON request bodies

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

// Error handler
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


