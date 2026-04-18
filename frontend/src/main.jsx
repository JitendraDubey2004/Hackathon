import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AppStoreProvider } from "./context/AppStore";
import "./style.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
