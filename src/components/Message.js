import React from 'react';
import './Message.scss';

// This component handles displaying individual chat messages
// It can show both user messages and bot responses with citations
const Message = ({ message }) => {
  // Figure out what type of message this is
  const isUser = message.role === 'user';  // Is this from the user or the bot?
  const isError = message.isError;         // Did something go wrong?

  // Convert timestamp to readable time format (like "2:30 PM")
  const formatTime = (timestamp) => {
    // Check if timestamp is valid
    if (!timestamp) {
      return 'Just now';
    }
    
    const date = new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // When user clicks a citation number, scroll to that source
  const scrollToCitation = (citationNumber) => {
    // Find the citation element by its ID (unique per message)
    const citationElement = document.getElementById(`citation-${message.id}-${citationNumber}`);
    if (citationElement) {
      // Smoothly scroll to the citation
      citationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
     
      // Add a temporary highlight effect so user knows which one they clicked
      citationElement.classList.add('citation-highlight');
      // Remove the highlight after 2 seconds
      setTimeout(() => {
        citationElement.classList.remove('citation-highlight');
      }, 2000);
    }
  };

  // This function makes citation numbers clickable and pretty
  const renderMessageText = (text) => {
    // Don't process user messages or empty text
    if (!text || isUser) {
      return text;
    }

    // Look for citation patterns like [1], [2], [3, 5], [2, 7] in the text
    // The regex finds square brackets with numbers and commas inside
    const citationRegex = /\[([\d,\s]+)\]/g;
    // Split the text into parts - citation numbers will be separate
    const parts = text.split(citationRegex);
    
    // Go through each part and make citation numbers clickable
    return parts.map((part, index) => {
      // Odd indices are the citation numbers (due to how split works)
      if (index % 2 === 1) {
        // Extract individual numbers from complex citations like "3, 5" or "2, 7"
        const numbers = part.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        const firstNumber = numbers[0]; // Use the first number for scrolling
        
        return (
          <span
            key={index}
            className="citation-number"
            onClick={() => scrollToCitation(firstNumber)}
            title={`Click to view source ${firstNumber}`}
          >
            [{part}]
          </span>
        );
      }
      // Regular text parts just get returned as-is
      return part;
    });
  };

  return (
    <div className={`message ${isUser ? 'user' : 'bot'} ${isError ? 'error' : ''}`}>
      <div className="message-content">
        {/* Display the actual message text with clickable citations */}
        <div className="message-text">
          {message.text ? renderMessageText(message.text) : 'Message content not available'}
        </div>
        
        {/* Show sources if the bot provided any citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="citations">
            <div className="citations-header">Sources:</div>
            {message.citations.map((citation, index) => {
              // Use the citation's actual number if it has one, otherwise use index + 1
              const citationNumber = citation.number || (index + 1);
              return (
                <a
                  key={index}
                  id={`citation-${message.id}-${citationNumber}`}  // This ID is used for scrolling (unique per message)
                  href={citation.url}
                  target="_blank"  // Open in new tab
                  rel="noopener noreferrer"  // Security thing
                  className="citation-link"
                >
                  <span className="citation-index">[{citationNumber}]</span>
                  {citation.title}
                  {/* Show match percentage if available */}
                  {citation.score && (
                    <span className="citation-score">
                      ({Math.round(citation.score * 100)}% match)
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}
        
        {/* Show when the message was sent */}
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
