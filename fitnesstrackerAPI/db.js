const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace the connection string with your own local or cloud MongoDB URI
    await mongoose.connect('mongodb://127.0.0.1:27017/fitnesstracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
