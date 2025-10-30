import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, createUser, deleteUser } from "../services/userService";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    user_id: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    photo: ""
  });

  // 1) Fetch all users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // 2) Handle "Create User"
  const handleCreateUser = async () => {
    if (!newUser.user_id || !newUser.name) {
      alert("Please fill at least user_id and name!");
      return;
    }

    try {
      await createUser({
        ...newUser,
        age: Number(newUser.age) || 0,
        weight: Number(newUser.weight) || 0,
        height: Number(newUser.height) || 0
      });
      alert("User created successfully!");
      setShowForm(false);
      setNewUser({
        user_id: "",
        name: "",
        age: "",
        weight: "",
        height: "",
        photo: ""
      });
      loadUsers(); // refresh list
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user!");
    }
  };

  // 3) Handle "Delete User"
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      alert("User deleted successfully!");
      loadUsers(); // refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user!");
    }
  };

  // 4) Navigate to edit-user page
  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  return (
    <div style={styles.container}>
      <h1>User Management</h1>

      {/* List of users */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div>
          {users.map((u) => (
            <div key={u.user_id} style={styles.userCard}>
              {/* If you store a photo, display it */}
              {u.photo && (
                <img
                  src={u.photo}
                  alt="User"
                  style={{ width: "50px", borderRadius: "50%" }}
                />
              )}
              <div style={{ flex: 1, marginLeft: "10px" }}>
                <p>
                  <strong>ID:</strong> {u.user_id}
                </p>
                <p>
                  <strong>Name:</strong> {u.name}
                </p>
                <p>
                  <strong>Age:</strong> {u.age}
                </p>
                <p>
                  <strong>Weight:</strong> {u.weight} kg
                </p>
                <p>
                  <strong>Height:</strong> {u.height} cm
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleEditUser(u.user_id)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(u.user_id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Button to open "Add user" form */}
      <button onClick={() => setShowForm(true)} style={styles.addButton}>
        + Add New User
      </button>

      {/* Create user form */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2>Create a New User</h2>

          <input
            type="text"
            placeholder="User ID"
            value={newUser.user_id}
            onChange={(e) => setNewUser({ ...newUser, user_id: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={newUser.weight}
            onChange={(e) => setNewUser({ ...newUser, weight: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={newUser.height}
            onChange={(e) => setNewUser({ ...newUser, height: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={newUser.photo}
            onChange={(e) => setNewUser({ ...newUser, photo: e.target.value })}
            style={styles.input}
          />

          <div style={styles.buttonRow}>
            <button onClick={handleCreateUser} style={styles.saveButton}>
              Save User
            </button>
            <button onClick={() => setShowForm(false)} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- CSS-in-JS styles ----------------
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    textAlign: "left"
  },
  addButton: {
    margin: "20px 0",
    padding: "10px 20px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "orange",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px"
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  formContainer: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    textAlign: "left"
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "blue",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "gray",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default UserManagement;
