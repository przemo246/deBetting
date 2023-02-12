import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DAppProvider } from "@usedapp/core";
import { AuthProvider } from "@/fatures/auth";
import useDappConfig from "./useDappConfig";

import App from "./App";
import "./assets/css/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <DAppProvider config={useDappConfig}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </DAppProvider>
  </React.StrictMode>,
);
