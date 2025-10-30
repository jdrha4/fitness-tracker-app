import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUser } from "../services/userService";

function EditUser() {
  const { userId } = useParams(); 
  // if your route is /edit-user/:userId => userId might be "U001"

  const navigate = useNavigate();

  // Local state for the form
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    photo: ""
  });

  const [loading, setLoading] = useState(true);

  // 1) On mount, fetch the user details by ID
  useEffect(() => {
    fetchUserById(userId)
      .then((data) => {
        // Populate the form with the existing user data
        setFormData({
          user_id: data.user_id,   // must keep the same ID
          name: data.name || "",
          age: data.age || "",
          weight: data.weight || "",
          height: data.height || "",
          photo: data.photo || ""
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        alert("Error fetching user data!");
        setLoading(false);
      });
  }, [userId]);

  // 2) Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3) Save the changes via updateUser
  const handleSave = async () => {
    // Basic validation
    if (!formData.user_id || !formData.name) {
      alert("User ID and Name are required!");
      return;
    }

    // Convert numeric fields
    const updatedUser = {
      ...formData,
      age: Number(formData.age) || 0,
      weight: Number(formData.weight) || 0,
      height: Number(formData.height) || 0
    };

    try {
      await updateUser(formData.user_id, updatedUser);
      alert("User updated successfully!");
      // Navigate somewhere else (e.g. back to user management or home)
      navigate("/user-management");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user!");
    }
  };

  // Cancel and go back or somewhere else
  const handleCancel = () => {
    navigate("/user-management"); 
  };

  if (loading) {
    return <div style={styles.container}>Loading user data...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Edit User: {formData.user_id}</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
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
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Photo URL:</label>
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          style={styles.input}
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

// -------- CSS-in-JS styles --------
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
    backgroundColor: "blue",
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

export default EditUser;
