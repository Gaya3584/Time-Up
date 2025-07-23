import React, { useState } from "react";
import { createSchedule } from "../services/scheduleService";

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    location: "",
    irrigationNeeded: "",
    scheduledDate: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSchedule(formData);
      alert("Schedule submitted successfully!");
    } catch (err) {
      alert("Error submitting schedule.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="cropType" placeholder="Crop Type" onChange={handleChange} />
      <input name="soilType" placeholder="Soil Type" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="irrigationNeeded" placeholder="Irrigation Advice" onChange={handleChange} />
      <input type="datetime-local" name="scheduledDate" onChange={handleChange} />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ScheduleForm;
