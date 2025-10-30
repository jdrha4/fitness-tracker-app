Project structure:

fitnesstracker/
|
├── fitnesstrackerAPI/         # Backend folder
│   ├── models/                   # Mongoose models
│   │   ├── User.js
│   │   └── Workout.js
│   ├── routes/                   # Express routes
│   │   ├── userRoutes.js
│   │   └── workoutRoutes.js
│   ├── db.js                     # MongoDB connection
│   ├── server.js                 # Main Express server
│   |── package.json              # Node.js dependencies
|   └── package-lock.json         # Other Node.js things
|
├── fitnesstrackerClient/      # Frontend folder
│   ├── public/                   # Public assets
│   │   └── index.html
│   ├── src/                      # React source code
│   │   ├── components/           # React components
│   │   │   ├── Home.js
│   │   │   ├── WorkoutDetails.js
│   │   │   └── UserDetails.js    # Optional (if user details screen is needed)
│   │   ├── App.js                # Main React app
│   │   ├── index.js              # Entry point
│   │   └── styles/               # Optional folder for CSS styles
│   │       └── main.css
│   └── package.json              # React dependencies
|
└── README.md                     # Project documentation
