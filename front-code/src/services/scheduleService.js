import axios from "axios";

const API_URL = "http://localhost:5000/api/schedules";

// ✅ Create a new irrigation schedule
export const createSchedule = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

// ✅ Fetch all schedules
export const fetchSchedules = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

// ✅ Delete a schedule
export const deleteSchedule = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

// ✅ Update a schedule
export const updateSchedule = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};
