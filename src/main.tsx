import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@fortawesome/fontawesome-svg-core/styles.css';

// Initialize theme on app start
const initTheme = () => {
  const theme = localStorage.getItem("theme") || "system";
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
