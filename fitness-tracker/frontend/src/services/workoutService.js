import axios from "axios";
import API_URL from "./api";

// Get all workouts
export const fetchWorkouts = async () => {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data;
};

// Get single workout by ID
export const fetchWorkoutById = async (workoutId) => {
    const response = await axios.get(`${API_URL}/workouts/${workoutId}`);
    return response.data;
};

// Create a new workout
export const createWorkout = async (workoutData) => {
    console.log("Creating workout with data:", workoutData);

    try {
        const response = await axios.post(`${API_URL}/workouts`, workoutData);
        console.log("Workout added successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Create request failed:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Update a workout
export const updateWorkout = async (workoutId, workoutData) => {
    console.log(`Updating workout ID: ${workoutId}`, workoutData);
    
    try {
        const response = await axios.put(`${API_URL}/workouts/${workoutId}`, workoutData);
        console.log("Workout updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Update request failed:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Delete a workout
export const deleteWorkout = async (workoutId) => {
    const response = await axios.delete(`${API_URL}/workouts/${workoutId}`);
    return response.data;
};


export async function fetchWorkoutsByUserId(userId) {
    const { data } = await axios.get(`${API_URL}/workouts`);
    // filter by user_id
    return data.filter((w) => w.user_id === userId);
  };
  
