const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// ✅ Get all workouts
router.get("/", async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get a workout by ID
router.get("/:id", async (req, res) => {
    try {
        const workout = await Workout.findOne({ workout_id: req.params.id });
        if (!workout) return res.status(404).json({ message: "Workout not found" });
        res.json(workout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a workout by ID
router.delete("/:workout_id", async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ workout_id: req.params.workout_id });
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        res.json({ message: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// UPDATE a workout by ID
router.put("/:workout_id", async (req, res) => {
    try {
        console.log("Update request received:", req.params.workout_id, req.body);

        const workout = await Workout.findOneAndUpdate(
            { workout_id: req.params.workout_id }, // Ensure using "workout_id"
            req.body,
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        
        res.json(workout);
    } catch (error) {
        console.error("Workout update error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// CREATE a new workout
router.post("/", async (req, res) => {
    try {
        console.log("Received workout data:", req.body);

        if (!req.body.user_id || !req.body.workout_id || !req.body.type || !req.body.duration || !req.body.calories_burned) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newWorkout = new Workout(req.body);
        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (error) {
        console.error("Error adding workout:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
