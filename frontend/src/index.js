import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
//added this to it 
import './styles/styles.css';


const domain = "dev-k06j7xhhvoyppfkq.us.auth0.com";
const clientId = "tqq6iRdRdU4dXNCDEJ76A9BjDeQqwJt7";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);


