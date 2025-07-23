import React, { useEffect, useState } from "react";
import { fetchSchedules, deleteSchedule, updateSchedule } from "../services/scheduleService";
import './ScheduleList.css';
const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ cropType: "", scheduledDate: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () =>
    fetchSchedules().then((data) => {
      setSchedules(data);
    });

  const handleDelete = async (id) => {
    await deleteSchedule(id);
    loadData();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      cropType: item.cropType,
      scheduledDate: item.scheduledDate.slice(0, 16), // for datetime-local
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updateSchedule(editingId, formData);
    setEditingId(null);
    loadData();
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
                <input
                  type="text"
                  name="cropType"
                  className="edit-input"
                  value={formData.cropType}
                  onChange={handleChange}
                />
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  className="edit-input"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                />
                <div className="edit-actions">
                  <button className="action-button save-button" onClick={handleUpdate}>Save</button>
                  <button className="action-button cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="schedule-display">
                <div className="schedule-info">
                  <p className="crop-name">
                    <span className="crop-emoji">🌱</span> {item.cropType}
                  </p>
                  <p className="schedule-date">
                    <span className="date-emoji">📅</span>{" "}
                    {new Date(item.scheduledDate).toLocaleString()}
                  </p>
                </div>
                <div className="schedule-actions">
                  <button className="action-button edit-button" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="action-button delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
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
