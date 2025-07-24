import React, { useState, useEffect } from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleList from "./components/ScheduleList";
import CalendarView from "./components/CalendarView";
import Login from "./components/login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");

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
    }
  }, []);

  const handleLogin = (loggedInUsername) => {
    const displayName = loggedInUsername.includes("@")
      ? loggedInUsername.split("@")[0]
      : loggedInUsername;

    setUsername(displayName);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    setIsAuthenticated(false);
  };

  const goToRegister = () => setShowRegister(true);
  const goToLogin = () => setShowRegister(false);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <h1>Welcome, {username?.split("@")[0]}! 🌿</h1>
          <button onClick={handleLogout}>Logout</button>
          <ScheduleForm username={username} />
          <ScheduleList username={username} />
          <CalendarView />
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
