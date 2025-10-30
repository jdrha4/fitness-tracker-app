import { useParams } from "react-router-dom";

function WorkoutDetails() {
    const { id } = useParams();
    return <div>Workout Details for ID: {id}</div>;
}

export default WorkoutDetails;
