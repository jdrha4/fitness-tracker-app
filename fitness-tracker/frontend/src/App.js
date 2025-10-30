import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WorkoutDetails from "./pages/WorkoutDetails";
import UserDetails from "./pages/UserDetails";
import UserManagement from "./pages/UserManagement"; // <-- add this
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workout/:id" element={<WorkoutDetails />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/user-management" element={<UserManagement />} /> 
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/edit-user/:userId" element={<EditUser />} />
            </Routes>
        </Router>
    );
}

export default App;
