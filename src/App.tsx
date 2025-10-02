import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home/Home";
import History from "./pages/history/History";
import { SearchProvider } from "./context/SearchContext";
import "./App.css";

export default function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <nav className="navbar">
          <Link to="/" className="nav-button">
            Home
          </Link>
          <Link to="/history" className="nav-button">
            History
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}
