const express = require('express');
const router = express.Router();

const User = require('../models/User');

// 1) Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// 2) Get one user by id (user_id)
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// 3) Create/Add a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User({
      user_id: req.body.user_id,
      name: req.body.name,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

// 4) Update/Edit a user
router.put('/:user_id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.params.user_id },
      req.body,
      { new: true }  // return the updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// 5) Delete a user
router.delete('/:user_id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ user_id: req.params.user_id });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
