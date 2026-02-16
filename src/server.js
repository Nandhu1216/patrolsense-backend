const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("PatrolSense Backend Running");
});

// Routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/routes", require("./routes/route.routes"));
app.use("/api/assignments", require("./routes/assignment.routes"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
