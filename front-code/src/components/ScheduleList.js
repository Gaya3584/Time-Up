import React, { useEffect, useState } from "react";
import { fetchSchedules, deleteSchedule, updateSchedule } from "../services/scheduleService";

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
    <div>
      <h2>Scheduled Irrigations</h2>
      <ul>
        {schedules.map((item) => (
          <li key={item._id}>
            {editingId === item._id ? (
              <div>
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                />
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                🌱 {item.cropType} — 📅 {new Date(item.scheduledDate).toLocaleString()}
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList;
