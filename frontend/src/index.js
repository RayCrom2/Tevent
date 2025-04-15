import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import { ThemeProvider } from './context/ThemeContext';

const domain = "dev-k06j7xhhvoyppfkq.us.auth0.com";
const clientId = "tqq6iRdRdU4dXNCDEJ76A9BjDeQqwJt7";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    }}
  >
      <ThemeProvider> 
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
