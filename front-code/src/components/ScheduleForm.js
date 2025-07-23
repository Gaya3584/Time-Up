import React, { useState } from "react";
import { createSchedule } from "../services/scheduleService";
import "./ScheduleForm.css";
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
  <div className="schedule-form-container">
    <div className="form-header">
      <h2>Schedule Irrigation</h2>
      <p className="form-subtitle">Enter the crop details and irrigation time</p>
    </div>
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group floating-label">
          <input
            type="text"
            name="cropType"
            className="form-input"
            placeholder=" "
            value={formData.cropType}
            onChange={handleChange}
            required
          />
          <label className="form-label">Crop Type</label>
        </div>
        <div className="form-group floating-label">
          <input
            type="text"
            name="soilType"
            className="form-input"
            placeholder=" "
            value={formData.soilType}
            onChange={handleChange}
            required
          />
          <label className="form-label">Soil Type</label>
        </div>
      </div>
      <div className="form-group floating-label">
        <input
          type="text"
          name="location"
          className="form-input"
          placeholder=" "
          value={formData.location}
          onChange={handleChange}
          required
        />
        <label className="form-label">Location</label>
      </div>
      <div className="form-group floating-label">
        <input
          type="text"
          name="irrigationNeeded"
          className="form-input"
          placeholder=" "
          value={formData.irrigationNeeded}
          onChange={handleChange}
          required
        />
        <label className="form-label">Irrigation Advice</label>
      </div>
      <div className="form-group floating-label">
        <input
          type="datetime-local"
          name="scheduledDate"
          className="form-input"
          value={formData.scheduledDate}
          onChange={handleChange}
          required
        />
        <label className="form-label">Scheduled Date</label>
      </div>
      <div className="form-group floating-label">
        <input
          type="tel"
          name="phoneNumber"
          className="form-input"
          placeholder=" "
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <label className="form-label">Phone Number</label>
      </div>
      <button className="submit-button" type="submit">Submit</button>
    </form>
  </div>
);
}
export default ScheduleForm;
