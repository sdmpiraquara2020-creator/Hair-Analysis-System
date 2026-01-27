import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ClienteProvider } from "./context/ClienteContext";
import { AnalysisHistoryProvider } from "./context/AnalysisHistoryContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClienteProvider>
        <AnalysisHistoryProvider>
          <App />
        </AnalysisHistoryProvider>
      </ClienteProvider>
    </BrowserRouter>
  </React.StrictMode>
);
