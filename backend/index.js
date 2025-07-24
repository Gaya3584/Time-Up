const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scheduleRoutes = require("./routes/scheduleRoutes");
const authRoutes = require("./routes/routeauth"); // ✅ Import auth routes
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/schedules", scheduleRoutes);
app.use("/api/auth", authRoutes); // ✅ Mount auth routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Mongo error: ", err));

// Test route
app.get("/", (req, res) => {
  res.send("Smart Irrigation Scheduler backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
