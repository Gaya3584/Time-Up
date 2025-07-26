import React, { useState } from "react";
import "./ScheduleForm.css";

const ScheduleForm = ({ refetchSchedules }) => {
  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    location: "",
    irrigationNeeded: "",
    scheduledDate: "",
    phoneNumber: "",
    duration: "",
    autoSuggest: false,
  });

  const [suggestedDates, setSuggestedDates] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to schedule irrigation.");
      setLoading(false);
      return;
    }

    try {
      if (formData.autoSuggest) {
        const response = await fetch("http://localhost:5000/api/schedules/auto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.success) {
          // It's clearer to alert the user that schedules were CREATED.
          alert("Successfully auto-scheduled irrigations!");
          setSuggestedDates(result.schedules);
          
          // FIX 1: Refresh the main schedule list after auto-scheduling.
          refetchSchedules(); 
        } else {
          alert("Auto-scheduling failed");
        }
      } else {
        const response = await fetch("http://localhost:5000/api/schedules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Schedule submitted successfully!");
          refetchSchedules();
        } else {
          alert("Error saving schedule");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Submission error");
    }

    setLoading(false);
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
            <input type="text" name="cropType" className="form-input" placeholder=" " value={formData.cropType} onChange={handleChange} required />
            <label className="form-label">Crop Type</label>
          </div>
          <div className="form-group floating-label">
            <input type="text" name="soilType" className="form-input" placeholder=" " value={formData.soilType} onChange={handleChange} required />
            <label className="form-label">Soil Type</label>
          </div>
        </div>

        <div className="form-group floating-label">
          <input type="text" name="location" className="form-input" placeholder=" " value={formData.location} onChange={handleChange} required />
          <label className="form-label">Location</label>
        </div>

        <div className="form-group floating-label">
          <input type="text" name="irrigationNeeded" className="form-input" placeholder=" " value={formData.irrigationNeeded} onChange={handleChange} required />
          <label className="form-label">Irrigation Advice</label>
        </div>

        <div className="form-group floating-label">
          <input type="datetime-local" name="scheduledDate" className="form-input" value={formData.scheduledDate} onChange={handleChange} required={!formData.autoSuggest} disabled={formData.autoSuggest} />
          <label className="form-label">Scheduled Date</label>
        </div>

        <div className="form-group floating-label">
          <input type="tel" name="phoneNumber" className="form-input" placeholder=" " value={formData.phoneNumber} onChange={handleChange} required />
          <label className="form-label">Phone Number</label>
        </div>

        <select name="duration" value={formData.duration} onChange={handleChange} required={formData.autoSuggest}>
          <option value="">Select Duration</option>
          <option value="week">1 Week</option>
          <option value="month">1 Month</option>
        </select>

        <label className="checkbox-label">
          <input type="checkbox" name="autoSuggest" checked={formData.autoSuggest} onChange={handleChange} />
          Auto-Suggest Irrigation Dates
        </label>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {formData.autoSuggest && suggestedDates.length > 0 && (
        <div className="suggested-schedule-box">
          <h3>✨ AI-Suggested Irrigation Dates:</h3>
          <ul>
            {suggestedDates.map((item, idx) => (
              <li key={idx}>
                {new Date(item.scheduledDate).toLocaleString()} — for {item.cropType}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;
