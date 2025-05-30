import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const domain = "dev-k06j7xhhvoyppfkq.us.auth0.com";
const clientId = "tqq6iRdRdU4dXNCDEJ76A9BjDeQqwJt7";

//added this to it
const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>

);


