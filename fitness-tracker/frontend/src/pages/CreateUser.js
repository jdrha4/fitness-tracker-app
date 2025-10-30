import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";

function CreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    photo: ""
  });

  // Update form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle the Create User button
  const handleSave = async () => {
    // Basic validation
    if (!formData.user_id || !formData.name) {
      alert("Please enter at least user_id and name!");
      return;
    }

    // Convert numeric fields
    const userToCreate = {
      ...formData,
      age: Number(formData.age) || 0,
      weight: Number(formData.weight) || 0,
      height: Number(formData.height) || 0
    };

    try {
      await createUser(userToCreate);
      alert("User created successfully!");

      // Reset form or redirect
      setFormData({
        user_id: "",
        name: "",
        age: "",
        weight: "",
        height: "",
        photo: ""
      });
      // Go back home or to user management
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error.response ? error.response.data : error.message);
      alert("Error creating user!");
    }
  };

  // Cancel: either clear form or go somewhere else
  const handleCancel = () => {
    navigate("/"); // or wherever you want to go
  };

  return (
    <div style={styles.container}>
      <h2>Create a New User</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>User ID:</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          style={styles.input}
          placeholder="e.g. U999"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          placeholder="User name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={styles.input}
          placeholder="Age (years)"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Weight (kg):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          style={styles.input}
          placeholder="Weight in kg"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Height (cm):</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          style={styles.input}
          placeholder="Height in cm"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Photo URL (optional):</label>
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          style={styles.input}
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div style={styles.buttonRow}>
        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ------- Basic CSS-in-JS -------
const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontFamily: "Arial, sans-serif"
  },
  formGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  saveButton: {
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cancelButton: {
    backgroundColor: "gray",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default CreateUser;
