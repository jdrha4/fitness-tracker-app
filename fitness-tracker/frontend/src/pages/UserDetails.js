import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { fetchUserById, updateUser } from "../services/userService";
import { fetchWorkoutsByUserId } from "../services/workoutService";

function UserDetails() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    photo: ""
  });

  // -- New states for stats --
  const [workouts, setWorkouts] = useState([]); // all workouts for this user
  const [timeRange, setTimeRange] = useState("daily"); // daily/weekly/monthly for "workout time"
  const [calRange, setCalRange] = useState("weekly");  // weekly/monthly for "calories"

  useEffect(() => {
    // 1) Fetch user details
    fetchUserById(id)
      .then((data) => {
        setUser(data);
        setEditForm({
          name: data.name,
          age: data.age,
          weight: data.weight,
          height: data.height,
          photo: data.photo || ""
        });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    // 2) Fetch this user's workouts
    fetchWorkoutsByUserId(id)
      .then((userWorkouts) => setWorkouts(userWorkouts))
      .catch((err) => console.error("Error fetching user workouts:", err));
  }, [id]);

  // Edit button
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Change fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Change photo
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save
  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        name: editForm.name,
        age: Number(editForm.age),
        weight: Number(editForm.weight),
        height: Number(editForm.height),
        photo: editForm.photo
      };

      await updateUser(user.user_id, updatedUser);
      alert("User updated successfully!");

      // Refresh local data
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user!");
    }
  };

  // Cancel
  const handleCancel = () => {
    setEditForm({
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
      photo: user.photo || ""
    });
    setIsEditing(false);
  };

  // ------------------ STATISTICS LOGIC ------------------

  // 1) Filter workouts by date range (for "Workout Time")
  const filteredWorkoutsForTime = filterByRange(workouts, timeRange); 
  // e.g. if timeRange="daily", only today's workouts, etc.

  const totalWorkoutTime = filteredWorkoutsForTime.reduce(
    (sum, w) => sum + (w.duration || 0),
    0
  );

  // 2) Determine most favorite workout type (by frequency)
  const favoriteWorkout = getFavoriteWorkoutType(workouts);

  // 3) Filter workouts for "Calories" range (weekly/monthly)
  const filteredWorkoutsForCalories = filterByRange(workouts, calRange);
  const totalCalories = filteredWorkoutsForCalories.reduce(
    (sum, w) => sum + (w.calories_burned || 0),
    0
  );

  if (!user) return <div style={styles.loading}>Loading user details...</div>;

  return (
    <div style={styles.container}>
      
      {/* ---------------- VIEW MODE ---------------- */}
      {!isEditing && (
        <>
          {/* ---- User Basic Info ---- */}
          <div style={styles.profileHeader}>
            <img
              src={
                user.photo ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="User"
              style={styles.photo}
            />
            <div>
              <h2 style={styles.name}>{user.name}</h2>
              <p style={styles.age}>Age: {user.age}</p>
            </div>
          </div>

          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.icon}>⚖️</span> 
              <span>{user.weight} kg</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.icon}>📏</span> 
              <span>{user.height} cm</span>
            </div>
          </div>

          <button style={styles.editButton} onClick={handleEditClick}>
            Edit
          </button>

          {/* -------------- STATISTICS SECTION -------------- */}
          <div style={styles.statsSection}>
            <h3 style={styles.statsTitle}>User Statistics</h3>

            {/* 1) Workout Time */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <h4>Workout Time</h4>
                <select
                  style={styles.cardDropdown}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <p style={styles.cardValue}>
                {totalWorkoutTime} min
              </p>
            </div>

            {/* 2) Most Favorite Workout */}
            <div style={styles.statCard}>
              <h4>Most Favorite Workout</h4>
              <p style={styles.cardValue}>
                {favoriteWorkout || "N/A"}
              </p>
            </div>

            {/* 3) Calories Burned */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <h4>Calories Burned</h4>
                <select
                  style={styles.cardDropdown}
                  value={calRange}
                  onChange={(e) => setCalRange(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <p style={styles.cardValue}>
                {totalCalories} kcal
              </p>
            </div>

          </div>
        </>
      )}

      {/* ---------------- EDIT MODE ---------------- */}
      {isEditing && (
        <div style={styles.editContainer}>
          <h2 style={styles.editTitle}>Edit User</h2>

          <div style={styles.editPhotoWrapper}>
            <img
              src={
                editForm.photo ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="User"
              style={styles.photo}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={styles.fileInput}
            />
          </div>

          <label style={styles.label}>Name:</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleChange}
          />

          <label style={styles.label}>Age:</label>
          <input
            style={styles.input}
            type="number"
            name="age"
            value={editForm.age}
            onChange={handleChange}
          />

          <label style={styles.label}>Weight (kg):</label>
          <input
            style={styles.input}
            type="number"
            name="weight"
            value={editForm.weight}
            onChange={handleChange}
          />

          <label style={styles.label}>Height (cm):</label>
          <input
            style={styles.input}
            type="number"
            name="height"
            value={editForm.height}
            onChange={handleChange}
          />

          <div style={styles.buttonRow}>
            <button style={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <button style={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------- HELPERS ---------------------
/**
 * Filter workouts based on "daily", "weekly", or "monthly".
 * - daily = workouts from "today"
 * - weekly = last 7 days
 * - monthly = last 30 days
 */
function filterByRange(workouts, range) {
    const now = new Date();
    return workouts.filter((w) => {
      if (!w.date) return false;
      const workoutDate = new Date(w.date);
      if (isNaN(workoutDate.getTime())) {
        // invalid date
        return false;
      }
  
      const diff = (now - workoutDate) / (1000 * 60 * 60 * 24);
  
      if (range === "daily") {
        // same calendar day
        return (
          workoutDate.getFullYear() === now.getFullYear() &&
          workoutDate.getMonth() === now.getMonth() &&
          workoutDate.getDate() === now.getDate()
        );
      } else if (range === "weekly") {
        // within last 7 days or next 7 days if negative
        return Math.abs(diff) <= 7;
      } else if (range === "monthly") {
        return Math.abs(diff) <= 30;
      }
      return true;
    });
  }
  

/** Finds the workout type with the highest frequency. Returns null if none. */
function getFavoriteWorkoutType(workouts) {
  if (!workouts.length) return null;
  const freqMap = {};
  for (let w of workouts) {
    if (!w.type) continue;
    freqMap[w.type] = (freqMap[w.type] || 0) + 1;
  }
  // find the type with the max count
  let favorite = null;
  let maxCount = 0;
  for (let type in freqMap) {
    if (freqMap[type] > maxCount) {
      maxCount = freqMap[type];
      favorite = type;
    }
  }
  return favorite;
}

// ------------------- CSS STYLES -------------------
const styles = {
  loading: {
    textAlign: "center",
    marginTop: "50px"
  },
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },
  photo: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "20px"
  },
  name: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0
  },
  age: {
    color: "#888",
    margin: "5px 0 0 0"
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px"
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px"
  },
  icon: {
    marginRight: "8px",
    fontSize: "20px"
  },
  editButton: {
    backgroundColor: "#2980b9",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  },
  // EDIT MODE
  editContainer: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px"
  },
  editTitle: {
    fontSize: "20px",
    marginBottom: "15px"
  },
  editPhotoWrapper: {
    marginBottom: "15px"
  },
  fileInput: {
    display: "block",
    marginTop: "10px"
  },
  label: {
    display: "block",
    marginBottom: "5px",
    marginTop: "10px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px",
    marginTop: "10px"
  },
  saveButton: {
    backgroundColor: "green",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  },
  cancelButton: {
    backgroundColor: "red",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  },
  // STATISTICS
  statsSection: {
    marginTop: "40px"
  },
  statsTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center"
  },
  statCard: {
    backgroundColor: "#eaeaea",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardDropdown: {
    fontSize: "14px",
    padding: "5px"
  },
  cardValue: {
    fontSize: "18px",
    marginTop: "10px",
    fontWeight: "bold"
  }
};

export default UserDetails;
