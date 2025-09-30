import React from "react";
import "./App.css";
import {
  Link,
  Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/home/Home";
import History from "./pages/history/History";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/history">History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        {/* Redirect unknown paths to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
