import axios from "axios";

const API_URL = "http://localhost:5000/api/schedules";
const token = localStorage.getItem("token");

const authHeader = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

export const fetchSchedules = async () => {
  const response = await axios.get(API_URL, authHeader);
  return response.data;
};

export const createSchedule = async (schedule) => {
  const response = await axios.post(API_URL, schedule, authHeader);
  return response.data;
};

export const deleteSchedule = async (id) => {
  await axios.delete(`${API_URL}/schedules/${id}`, authHeader);
};

export const updateSchedule = async (id, updated) => {
  const response = await axios.put(`${API_URL}/schedules/${id}`, updated, authHeader);
  return response.data;
};
