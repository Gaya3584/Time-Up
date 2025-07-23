const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// Create schedule
router.post("/", async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const saved = await newSchedule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all schedules
router.get("/", async (req, res) => {
  const data = await Schedule.find();
  res.json(data);
});
router.delete("/schedules/:id", async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});
router.put("/schedules/:id", async (req, res) => {
  const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
