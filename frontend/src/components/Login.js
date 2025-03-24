import React, { useState } from "react";
import { loginUser } from "../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      console.log("✅ Logged in:", data);
      // Optionally store token in localStorage
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("❌ Login error:", err.message);
    }
  };

  return (
    <div>
      <h2>Login to Tevent</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
