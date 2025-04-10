// ProtectedRoute.js
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    // Only attempt redirect if we're done loading and the user is not authenticated
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // While Auth0 is checking authentication status, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the children (e.g. <UserProfile />) if authenticated; otherwise do nothing
  return isAuthenticated ? children : null;
}
