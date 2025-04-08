import React, { useState } from "react";
import axios from "axios";

const FriendSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
        const res = await axios.get(`http://localhost:5001/api/search-users?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await axios.post("/api/add-friend", {
        currentUserId: "123", // Replace this with the real user ID from auth/session
        targetUserId: userId,
      });
      alert("Friend request sent!");
    } catch (err) {
      console.error("Failed to add friend", err);
    }
  };

  return (
    <div>
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Enter a name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendSearch;