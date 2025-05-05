// ProtectedRoute.js
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// 1) Top-level placeholder component
function ProfilePlaceholder({ onFallback }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        textAlign: "center",
        color: "#666",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#eee",
          marginBottom: "1rem",
          animation: "pulse 1.5s infinite",
        }}
      />
      <h2 style={{ marginBottom: ".5rem" }}>
        Hold tight—let’s get you signed in!
      </h2>
      <p style={{ maxWidth: 320, marginBottom: "1.5rem" }}>
        You need to be logged in to view your profile. Redirecting you to the
        login page now…
      </p>
      <button
        onClick={onFallback}
        style={{
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: 4,
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  // 2) Kick off toast+redirect when we know we're not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("⚠️ You must be logged in to access this page.");
      toast.info("Redirecting to Log-In…");
      const timer = setTimeout(() => {
        loginWithRedirect({ appState: { returnTo: location.pathname } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname]);

  if (isLoading) {
    return <div>Loading…</div>;
  }

  // 3) If not authenticated, render the placeholder
  if (!isAuthenticated) {
    return (
      <ProfilePlaceholder
        onFallback={() => loginWithRedirect({ appState: { returnTo: location.pathname } })}
      />
    );
  }

  // 4) Otherwise render the protected content
  return children;
}
