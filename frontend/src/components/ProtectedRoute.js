// ProtectedRoute.js
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';



export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Show the toast
      toast.error("⚠️ You must be logged in to access this page.");
      toast.info("Redirecting to Log-In...")
  
      // Delay the redirect, e.g. 3 seconds
      const timer = setTimeout(() => {
        loginWithRedirect();
      }, 3000);
  
      // Clear timeout if this component unmounts
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null; // null since loginWithRedirect will handle the redirect
}
