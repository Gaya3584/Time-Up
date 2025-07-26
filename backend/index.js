const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ⬅️ Added to serve frontend

const scheduleRoutes = require("./routes/scheduleRoutes");
const authRoutes = require("./routes/routeauth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/schedules", scheduleRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Mongo error: ", err));

// ✅ Serve React static files (only in production)
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// ✅ Fallback to React for non-API routes
app.get("*", (req, res) => {
  if (!req.originalUrl.startsWith("/api")) {
    res.sendFile(path.join(buildPath, "index.html"));
  } else {
    res.status(404).send("API route not found");
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

