import axios from "axios";

const API_URL = "http://localhost:5000/api/schedules";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const fetchSchedules = async () => {
  // Get the latest headers right before the request
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createSchedule = async (schedule) => {
  // Get the latest headers right before the request
  const response = await axios.post(API_URL, schedule, getAuthHeaders());
  return response.data;
};

export const deleteSchedule = async (id) => {
  // Get the latest headers right before the request
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};

export const updateSchedule = async (id, updated) => {
  // Get the latest headers right before the request
  const response = await axios.put(`${API_URL}/${id}`, updated, getAuthHeaders());
  return response.data;
};