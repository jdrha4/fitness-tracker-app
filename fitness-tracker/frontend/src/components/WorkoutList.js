import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteWorkout, updateWorkout } from "../services/workoutService";

function WorkoutList({ workouts, userMap = {} }) {
  const navigate = useNavigate();

  const [editingWorkout, setEditingWorkout] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  const handleDelete = async (workoutId, e) => {
    e.stopPropagation(); // prevent card click
    try {
      await deleteWorkout(workoutId);
      alert("Workout deleted!");
      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to delete workout:",
        error.response ? error.response.data : error.message
      );
      alert("Error deleting workout!");
    }
  };

  const handleEdit = (workout, e) => {
    e.stopPropagation(); // prevent card click
    setEditingWorkout(workout.workout_id);

    // Convert date to YYYY-MM-DD for <input type="date">
    const isoDate = workout.date
      ? new Date(workout.date).toISOString().slice(0, 10)
      : "";

    setUpdatedData({
      type: workout.type,
      duration: workout.duration,
      calories_burned: workout.calories_burned,
      date: isoDate
    });
  };

  const handleUpdate = async (workoutId) => {
    console.log(`Sending update request for workout ID: ${workoutId}`, updatedData);
    try {
      await updateWorkout(workoutId, {
        ...updatedData,
        duration: +updatedData.duration,
        calories_burned: +updatedData.calories_burned
      });
      alert("Workout updated!");
      setEditingWorkout(null);
      window.location.reload();
    } catch (error) {
      console.error(
        "Workout update failed:",
        error.response ? error.response.data : error.message
      );
      alert("Error updating workout!");
    }
  };

  // Clicking the card navigates to the user detail
  const handleCardClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  if (!workouts || workouts.length === 0) {
    return <p>No workouts available.</p>;
  }

  return (
    <div>
      {workouts.map((workout) => {
        const isEditing = editingWorkout === workout.workout_id;
        const userInfo = userMap[workout.user_id] || {};
        const userName = userInfo.name || "Unknown User";
        const userPhoto =
          userInfo.photo ||
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"; // fallback photo

        const workoutDate = workout.date
          ? new Date(workout.date).toLocaleDateString()
          : "N/A";

        // The whole container clickable if not editing
        return (
          <div
            key={workout.workout_id}
            style={styles.workoutContainer}
            onClick={() => !isEditing && handleCardClick(workout.user_id)}
          >
            {isEditing ? (
              // EDIT MODE
              <div style={styles.editForm}>
                <input
                  type="text"
                  value={updatedData.type}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, type: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Workout Type"
                />

                <input
                  type="number"
                  value={updatedData.duration}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, duration: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Duration (min)"
                />

                <input
                  type="number"
                  value={updatedData.calories_burned}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      calories_burned: e.target.value
                    })
                  }
                  style={styles.input}
                  placeholder="Calories Burned"
                />

                <input
                  type="date"
                  value={updatedData.date}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, date: e.target.value })
                  }
                  style={styles.input}
                />

                <div style={styles.buttonRow}>
                  <button
                    onClick={() => handleUpdate(workout.workout_id)}
                    style={styles.updateButton}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingWorkout(null)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <>
                {/* User Photo & Name */}
                <div style={styles.userRow}>
                  <img src={userPhoto || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}alt="User photo" style={styles.userPhoto} />
                   {/* OPTIONAL: Show the user's name if userMap is provided */}
                   {userMap[workout.user_id] && (<div style={styles.userName}>{userMap[workout.user_id]}</div>)}
                </div>

                {/* Workout Type (big & bold) */}
                <div style={styles.workoutType}>{workout.type}</div> 

                {/* Time & Calories in one row */}
                <div style={styles.timeCalRow}>
                  <div style={styles.timeCalItem}>⏱️ {workout.duration} min</div>
                  <div style={styles.timeCalItem}>🔥 {workout.calories_burned} kcal</div>
                </div>

                {/* Date in light grey */}
                <div style={styles.date}>{workoutDate}</div>

                {/* Buttons aligned to the right */}
                <div style={styles.buttonRow}>
                  <button
                    onClick={(e) => handleEdit(workout, e)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(workout.workout_id, e)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  workoutContainer: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px",
    margin: "15px 0",
    backgroundColor: "#fff",
    cursor: "pointer",
    position: "relative" // for potential advanced styling
  },
  // EDIT MODE
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center"
  },
  input: {
    width: "80%",
    padding: "6px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
    gap: "10px"
  },
  editButton: {
    padding: "6px 12px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "orange",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "6px 12px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "red",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  updateButton: {
    padding: "6px 12px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "green",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "6px 12px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "gray",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  // VIEW MODE
  userRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
  },
  userPhoto: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px"
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold"
  },
  workoutType: {
    fontSize: "40px",
    fontWeight: "bold",
    margin: "8px 0",
    textAlign: "left"

  },
  timeCalRow: {
    display: "flex",
    //justifyContent: "space-around",
    marginBottom: "8px",
    alignItems: "left"
  },
  timeCalItem: {
    fontSize: "14px"
  },
  date: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "8px",
    textAlign: "left"
  }
};

export default WorkoutList;
