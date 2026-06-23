import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-bar-icon">🔍</span>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Search charts..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-bar-clear" onClick={() => onChange('')}>✕</button>
      )}
    </div>
  );
}
