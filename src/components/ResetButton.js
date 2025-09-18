import React, { useState } from 'react';
import './ResetButton.scss';

// This component shows a reset button that requires confirmation to prevent accidents
const ResetButton = ({ onReset }) => {
  const [isConfirming, setIsConfirming] = useState(false);  // Are we in confirmation mode?

  const handleClick = () => {
    if (isConfirming) {
      // User clicked confirm, actually reset the chat
      onReset();
      setIsConfirming(false);
    } else {
      // First click - show confirmation
      setIsConfirming(true);
      // Auto-cancel confirmation after 3 seconds if user doesn't click again
      setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
    }
  };

  return (
    <button
      className={`reset-button ${isConfirming ? 'confirming' : ''}`}
      onClick={handleClick}
      title={isConfirming ? 'Click again to confirm' : 'Reset conversation'}
    >
      {isConfirming ? (
        // Show confirmation state with checkmark icon
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Confirm Reset
        </>
      ) : (
        // Show normal reset state with refresh icon
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reset
        </>
      )}
    </button>
  );
};

export default ResetButton;
