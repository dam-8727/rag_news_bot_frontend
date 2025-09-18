import React from 'react';
import './TypingIndicator.scss';

// This component shows a "typing" animation when the bot is thinking
const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      {/* Three animated dots that bounce to show activity */}
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      {/* Text that says the bot is typing */}
      <span className="typing-text">Bot is typing...</span>
    </div>
  );
};

export default TypingIndicator;
