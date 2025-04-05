import React, { useState } from "react";
import { registerUser } from "../services/authService";
//import { registerAdmin } from "../services/authService"; // ✅ make sure this path is correct

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      console.log("📤 Calling registerAdmin()");
      //const data = await registerAdmin(username, password, dateOfBirth);
      const data = await registerUser(username, password, dateOfBirth);

      console.log("✅ Registered:", data);
      setMessage("✅ Registration successful!");
    } catch (err) {
      console.error("❌ Registration error:", err.message);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register for Tevent</h2>

      <input
        type="text"
        placeholder="Username"
        className="form-control my-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="form-control my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="date"
        className="form-control my-2"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleRegister}>
        Register
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Register;
