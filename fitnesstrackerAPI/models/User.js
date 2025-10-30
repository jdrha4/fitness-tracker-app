const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  age: Number,
  weight: Number,
  height: Number,
  photo: String
});

module.exports = mongoose.model('User', userSchema);
