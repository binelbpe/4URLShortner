import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import App from "./App";
import "./index.css";
import LoadingSpinner from "./components/LoadingSpinner";

// Check for stored tokens
const tokens = localStorage.getItem("tokens");
if (tokens) {
  try {
    const parsedTokens = JSON.parse(tokens);
    if (parsedTokens.accessToken && parsedTokens.refreshToken) {
      store.dispatch({
        type: "auth/setTokens",
        payload: {
          ...parsedTokens,
          isAuthenticated: true,
        },
      });
    }
  } catch (error) {
    localStorage.removeItem("tokens");
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
