import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="container text-center mt-5">
      <h2>{isAuthenticated ? `Welcome, ${user.name}` : "Welcome to Tevent"}</h2>

      {isAuthenticated ? (
        <div>
          <img src={user.picture} alt="Profile" width="50" className="rounded-circle" />
          <br />
          <button
            className="btn btn-danger mt-3"
            onClick={() => logout({ returnTo: `${window.location.origin}/about` })}
          >
            Logout
          </button>
        </div>
      ) : (
        <button className="btn btn-primary mt-3" onClick={() => loginWithRedirect()}>
          Login with Auth0
        </button>
      )}
    </div>
  );
};

export default Login;
