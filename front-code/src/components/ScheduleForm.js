import React, { useState } from "react";
import { createSchedule } from "../services/scheduleService";
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";
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
      // Save schedule to database
      await createSchedule(formData);
      alert("Schedule submitted successfully!");

      // Ask for push notification permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BBPPA0pP5eCiB6_9477vaPmFpzW7NSZ9Bj6F-Y2OL6jTxtT2v84B8aHATHBjHvY9TEQhilLzhE7FO4n4q_aBqLo" // 🔑 Replace with your key from Firebase
        });

        if (token) {
          console.log("✅ FCM Token:", token);

          // Optional: send token to backend to associate with phone/user
          // await fetch("http://localhost:5000/api/notifications/token", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ token, phoneNumber: formData.phoneNumber }),
          // });
        } else {
          console.warn("⚠️ No token received");
        }
      } else {
        console.warn("🔕 Notifications denied");
      }

    } catch (err) {
      console.error("Error submitting:", err);
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
};

export default ScheduleForm;
