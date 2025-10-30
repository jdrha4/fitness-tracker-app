import axios from "axios";
import API_URL from "./api";

// Get all users
export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

// Get single user by ID
export const fetchUserById = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
};

// Create a new user
export const createUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
};

// Update an existing user
export const updateUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
};

