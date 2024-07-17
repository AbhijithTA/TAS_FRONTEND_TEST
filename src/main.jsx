import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./hooks/AuthProvider.jsx";
// import React from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
    {/* <React.StrictMode> */}
      <App />
      <ToastContainer position="bottom-right" />
    {/* </React.StrictMode> */}
    </AuthProvider>
  </Router>
);
