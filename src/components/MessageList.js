import React from 'react';
import Message from './Message';
import './MessageList.scss';

// This component displays all the chat messages in a list
const MessageList = ({ messages }) => {
  // If there are no messages yet, show a welcome screen with suggestions
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💬</div>
        <h3>Welcome to News Bot!</h3>
        <p>Ask me anything about the latest news and I'll help you find relevant information.</p>
        {/* Show some example topics to get users started */}
        <div className="suggestions">
          <span className="suggestion-tag">Latest tech news</span>
          <span className="suggestion-tag">Stock market updates</span>
          <span className="suggestion-tag">World events</span>
        </div>
      </div>
    );
  }

  // Render all messages using the Message component
  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
