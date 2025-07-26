import React, { useState } from "react";
import {
  deleteSchedule,
  updateSchedule,
} from "../services/scheduleService";
import "./ScheduleList.css";

// Format ISO to 'YYYY-MM-DDTHH:MM' for <input type="datetime-local">
const formatForInput = (isoString) => {
  const date = new Date(isoString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

// Format ISO to 'DD/MM/YYYY, HH:mm' for display
const formatForDisplay = (isoString) => {
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const ScheduleList = ({ schedules = [], refetchSchedules }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    cropType: "",
    scheduledDate: "",
    soilType: "",
    location: "",
    irrigationNeeded: "",
    phoneNumber: "",
  });
  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id, token);
      refetchSchedules();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      cropType: item.cropType || "",
      scheduledDate: formatForInput(item.scheduledDate),
      soilType: item.soilType || "",
      location: item.location || "",
      irrigationNeeded: item.irrigationNeeded || "",
      phoneNumber: item.phoneNumber || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateSchedule(
        editingId,
        {
          ...formData,
          scheduledDate: new Date(formData.scheduledDate).toISOString(),
        },
        token
      );
      setEditingId(null);
      refetchSchedules();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      cropType: "",
      scheduledDate: "",
      soilType: "",
      location: "",
      irrigationNeeded: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="schedule-list-container">
      <div className="list-header">
        <h2>Scheduled Irrigations</h2>
        <p className="list-subtitle">All upcoming schedules</p>
      </div>

      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No schedules found</h3>
        </div>
      ) : (
        <ul className="schedules-grid">
          {schedules.map((item) => (
            <li key={item._id} className="schedule-item">
              {editingId === item._id ? (
                <div className="edit-form">
                  <div className="edit-form-grid">
                    <div className="form-group">
                      <label className="edit-label">Crop Type</label>
                      <input
                        type="text"
                        name="cropType"
                        className="edit-input"
                        value={formData.cropType}
                        onChange={handleChange}
                        placeholder="Enter crop type"
                      />
                    </div>

                    <div className="form-group">
                      <label className="edit-label">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        className="edit-input"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="edit-label">Soil Type</label>
                      <input
                        type="text"
                        name="soilType"
                        className="edit-input"
                        value={formData.soilType}
                        onChange={handleChange}
                        placeholder="Enter soil type"
                      />
                    </div>

                    <div className="form-group">
                      <label className="edit-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        className="edit-input"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                      />
                    </div>

                    <div className="form-group">
                      <label className="edit-label">Irrigation Advice</label>
                      <input
                        type="text"
                        name="irrigationNeeded"
                        className="edit-input"
                        value={formData.irrigationNeeded}
                        onChange={handleChange}
                        placeholder="Enter irrigation advice"
                      />
                    </div>

                    <div className="form-group">
                      <label className="edit-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="edit-input"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="action-button save-button"
                      onClick={handleUpdate}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      className="action-button cancel-button"
                      onClick={handleCancel}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="schedule-display">
                  <div className="schedule-info">
                    <p className="crop-name">🌱 {item.cropType}</p>
                    <p className="schedule-date">
                      📅 {formatForDisplay(item.scheduledDate)}
                    </p>
                    {item.location && (
                      <p className="schedule-location">📍 {item.location}</p>
                    )}
                    {item.soilType && (
                      <p className="schedule-soil">🌍 {item.soilType}</p>
                    )}
                    {item.irrigationNeeded && (
                      <p className="schedule-advice">💧 {item.irrigationNeeded}</p>
                    )}
                    {item.phoneNumber && (
                      <p className="schedule-phone">📞 {item.phoneNumber}</p>
                    )}
                  </div>
                  <div className="schedule-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduleList;