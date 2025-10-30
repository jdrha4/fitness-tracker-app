const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  workout_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true
  },
  date: Date,
  type: String,
  duration: Number,
  calories_burned: Number
});

// Create a text index on the `type` (and/or date) field to allow text searching
workoutSchema.index({ type: 'text' });

module.exports = mongoose.model('Workout', workoutSchema);
