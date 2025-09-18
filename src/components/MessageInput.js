import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.scss';

// This component handles the text input where users type their messages
const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');  // The current text in the input
  const textareaRef = useRef(null);            // Reference to the textarea element

  // Handle form submission (when user clicks send or presses Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send if there's actual text and we're not disabled
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');  // Clear the input after sending
    }
  };

  // Handle keyboard input - send on Enter, but allow Shift+Enter for new lines
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Update the message state when user types
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // Automatically resize the textarea as the user types more text
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="input-container">
        {/* The textarea where users type their messages */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about the news..."
          disabled={disabled}
          className="message-textarea"
          rows="1"
        />
        {/* Send button with a paper plane icon */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}  // Disable if empty or loading
          className="send-button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
