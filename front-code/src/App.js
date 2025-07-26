import React, { useState, useEffect } from "react";
import { fetchSchedules } from "./services/scheduleService";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleList from "./components/ScheduleList";
import CalendarView from "./components/CalendarView";
import Login from "./components/login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [schedules, setSchedules] = useState([]);

  const loadSchedules = async () => {
    try {
      const data = await fetchSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      setSchedules([]); // Clear schedules on error
    }
  };
  // ✅ Load from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      const displayName = storedUsername.includes("@")
        ? storedUsername.split("@")[0]
        : storedUsername;

      setUsername(displayName);
      setIsAuthenticated(true);
      loadSchedules(); 
    }
  }, []);

  const handleLogin = (loggedInUsername) => {
    const displayName = loggedInUsername.includes("@")
      ? loggedInUsername.split("@")[0]
      : loggedInUsername;

    setUsername(displayName);
    setIsAuthenticated(true);
    loadSchedules(); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    setIsAuthenticated(false);
    setSchedules([]); 
  };

  const goToRegister = () => setShowRegister(true);
  const goToLogin = () => setShowRegister(false);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <h1>Welcome, {username?.split("@")[0]}! 🌿</h1>
          <button onClick={handleLogout}>Logout</button>
          <ScheduleForm username={username} refetchSchedules={loadSchedules}/>
          <ScheduleList username={username} schedules={schedules} refetchSchedules={loadSchedules}/>
          <CalendarView schedules={schedules}/>
        </>
      ) : showRegister ? (
        <Register onRegister={goToLogin} goToLogin={goToLogin} />
      ) : (
        <Login onLogin={handleLogin} goToRegister={goToRegister} />
      )}
    </div>
  );
}

export default App;
