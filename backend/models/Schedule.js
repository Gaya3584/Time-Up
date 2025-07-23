const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  cropType: String,
  soilType: String,
  location: String,
  irrigationNeeded: String,
  scheduledDate: Date,
  phoneNumber: String,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
