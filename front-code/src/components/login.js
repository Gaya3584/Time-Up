// src/components/Login.js
import React, { useState } from "react";

const Login = ({ onLogin, goToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful");

        // Store token and username in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        onLogin(data.username); // pass the username to parent
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button
          onClick={goToRegister}
          style={{
            background: "none",
            color: "blue",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
