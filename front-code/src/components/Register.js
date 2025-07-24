// src/components/Register.js
import React, { useState } from "react";

const Register = ({ onRegister, goToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registered successfully!");
        onRegister(); // redirect to login
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Choose Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Choose Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <button
          onClick={goToLogin}
          style={{
            background: "none",
            color: "blue",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
