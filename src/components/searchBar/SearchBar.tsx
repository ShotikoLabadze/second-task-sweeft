import React from "react";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search photos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
