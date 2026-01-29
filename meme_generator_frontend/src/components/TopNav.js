import React from 'react';
import './TopNav.css';

// PUBLIC_INTERFACE
/**
 * Top navigation bar component
 * @param {Object} props - Component props
 * @param {Function} props.onReset - Callback to reset the editor
 */
function TopNav({ onReset }) {
  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <h1 className="nav-title">🎨 Meme Generator</h1>
      </div>
      <div className="nav-actions">
        <button
          className="btn btn-secondary"
          onClick={onReset}
          aria-label="Reset editor"
        >
          🔄 Reset
        </button>
      </div>
    </nav>
  );
}

export default TopNav;
