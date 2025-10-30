import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchWorkouts, createWorkout } from "../services/workoutService";
import { fetchUsers } from "../services/userService";

import WorkoutList from "../components/WorkoutList";

function Home() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);         
    const [selectedUserId, setSelectedUserId] = useState("");
    const [workouts, setWorkouts] = useState([]);   
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("calories_burned");

    const [showForm, setShowForm] = useState(false);
    const [newWorkout, setNewWorkout] = useState({
        type: "",
        duration: "",
        calories_burned: "",
        user_id: "",
        date: ""  // NEW: store the date here
    });

    // For opening a "Create User" page or modal
    const handleNewUser = () => {
        navigate("/create-user");
    };

    // Fetch users on mount
    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users:", err));
    }, []);

    // Fetch workouts on mount
    useEffect(() => {
        fetchWorkouts()
            .then((data) => setWorkouts(data))
            .catch((error) => console.error("Error fetching workouts:", error));
    }, []);

    // Filter by user
    const handleUserSelect = (e) => {
        setSelectedUserId(e.target.value);
    };

    const handleAddWorkout = () => {
        setShowForm(true);
    };

    const handleSaveWorkout = async () => {
        if (
            !newWorkout.type ||
            !newWorkout.duration ||
            !newWorkout.calories_burned ||
            !newWorkout.user_id ||
            !newWorkout.date
        ) {
            alert("Please fill in all fields!");
            return;
        }

        const workoutToSave = {
            workout_id: `W${Date.now()}`, 
            user_id: newWorkout.user_id,
            type: newWorkout.type,
            duration: +newWorkout.duration,
            calories_burned: +newWorkout.calories_burned,
            date: newWorkout.date  // This should be a valid date string
        };

        try {
            await createWorkout(workoutToSave);
            alert("Workout added!");
            setShowForm(false);
            setNewWorkout({
                type: "",
                duration: "",
                calories_burned: "",
                user_id: "",
                date: ""
            });
            window.location.reload(); 
        } catch (error) {
            console.error(
                "Error adding workout:",
                error.response ? error.response.data : error.message
            );
            alert("Error adding workout!");
        }
    };

    // Filter, search, sort
    const filteredWorkouts = workouts
        // Filter by selected user
        .filter((workout) =>
            selectedUserId ? workout.user_id === selectedUserId : true
        )
        // Filter by search term
        .filter((workout) =>
            workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(workout.calories_burned).includes(searchTerm) ||
            String(workout.duration).includes(searchTerm)
        )
        // Sort
        .sort((a, b) => b[sortBy] - a[sortBy]);

    // Navigate to the user's detail page
    const handleUserDetails = () => {
        if (!selectedUserId) return;
        navigate(`/user/${selectedUserId}`);
    };

    // Create a user map: { "U001": "Alice", ... } to display name next to each workout
    const userMap = users.reduce((acc, u) => {
        acc[u.user_id] = u.name;
        return acc;
    }, {});

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Better Your Life with Our Fitness App</h1>
            <p style={styles.subtext}>
                Track your workouts, monitor your progress, and achieve your fitness goals!
            </p>

            {/* TOP CONTROLS */}
            <div style={styles.topControls}>
                <select
                    style={styles.userSelect}
                    value={selectedUserId}
                    onChange={handleUserSelect}
                >
                    <option value="">-- All Users --</option>
                    {users.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                            {u.name}
                        </option>
                    ))}
                </select>

                <button
                    style={styles.userDetailsButton}
                    onClick={handleUserDetails}
                    disabled={!selectedUserId}
                >
                    {selectedUserId
                        ? `Go to ${users.find((u) => u.user_id === selectedUserId)?.name}'s Details`
                        : "Select a User"}
                </button>

                {/* NEW USER BUTTON (top-right corner) */}
                <button style={styles.newUserButton} onClick={handleNewUser}>
                    + New User
                </button>
            </div>

            {/* SEARCH & SORT CONTROLS */}
            <div style={styles.controlsContainer}>
                <button onClick={handleAddWorkout} style={styles.addButton}>
                    + Add Workout
                </button>

                <input
                    type="text"
                    placeholder="Search workouts by type, calories, or time..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />

                <select
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy}
                    style={styles.sortDropdown}
                >
                    <option value="calories_burned">🔥 Calories Burned</option>
                    <option value="duration">⏱️ Duration</option>
                </select>
            </div>

            {/* ADD WORKOUT FORM */}
            {showForm && (
                <div style={styles.formContainer}>
                    <h2>Add New Workout</h2>

                    {/* User ID Selection */}
                    <select
                        value={newWorkout.user_id}
                        onChange={(e) =>
                            setNewWorkout({
                                ...newWorkout,
                                user_id: e.target.value
                            })
                        }
                        style={styles.input}
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u.user_id} value={u.user_id}>
                                {u.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Workout Type"
                        value={newWorkout.type}
                        onChange={(e) =>
                            setNewWorkout({ ...newWorkout, type: e.target.value })
                        }
                        style={styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Duration (min)"
                        value={newWorkout.duration}
                        onChange={(e) =>
                            setNewWorkout({ ...newWorkout, duration: e.target.value })
                        }
                        style={styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Calories Burned"
                        value={newWorkout.calories_burned}
                        onChange={(e) =>
                            setNewWorkout({
                                ...newWorkout,
                                calories_burned: e.target.value
                            })
                        }
                        style={styles.input}
                    />

                    {/* DATE PICKER */}
                    <input
                        type="date"
                        value={newWorkout.date}
                        onChange={(e) =>
                            setNewWorkout({ ...newWorkout, date: e.target.value })
                        }
                        style={styles.input}
                    />

                    <button onClick={handleSaveWorkout} style={styles.saveButton}>
                        Save Workout
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* DISPLAY WORKOUTS + PASS userMap FOR NAMES */}
            <WorkoutList workouts={filteredWorkouts} userMap={userMap} />
        </div>
    );
}

// CSS-in-JS styles
const styles = {
    container: {
        textAlign: "center",
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px"
    },
    heading: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "10px"
    },
    subtext: {
        fontSize: "18px",
        color: "#666",
        marginBottom: "20px"
    },
    topControls: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
    },
    newUserButton: {
        padding: "10px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "purple",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    userSelect: {
        fontSize: "16px",
        padding: "5px"
    },
    userDetailsButton: {
        backgroundColor: "#2980b9",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
    },
    controlsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
    },
    addButton: {
        padding: "10px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "green",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    searchInput: {
        width: "50%",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },
    sortDropdown: {
        fontSize: "16px",
        padding: "5px"
    },
    formContainer: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "left",
        marginTop: "20px"
    },
    input: {
        width: "100%",
        padding: "8px",
        fontSize: "16px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },
    saveButton: {
        padding: "10px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "blue",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "5px"
    },
    cancelButton: {
        padding: "10px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "gray",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default Home;
