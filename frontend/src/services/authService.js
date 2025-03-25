const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";  //Uses environment variable

export const registerUser = async (username, password, dateOfBirth) => {
    console.log("📩 /authService hit!");
    const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password}),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed.");
    return data;
};


export const loginUser = async (username, password) => {
    const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed.");
    return data;
};