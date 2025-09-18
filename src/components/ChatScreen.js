import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ResetButton from './ResetButton';
import TypingIndicator from './TypingIndicator';
import apiService from '../services/api';
import './ChatScreen.scss';

// This is the main chat component that handles the entire conversation
const ChatScreen = () => {
  // State variables to keep track of everything
  const [messages, setMessages] = useState([]);        // All the chat messages
  const [sessionId, setSessionId] = useState(null);    // Unique ID for this chat session
  const [isLoading, setIsLoading] = useState(false);   // Is the bot thinking?
  const [isTyping, setIsTyping] = useState(false);     // Show typing animation
  const messagesEndRef = useRef(null);                 // Reference to scroll to bottom

  // When the component first loads, check if we have a saved chat session
  useEffect(() => {
    const storedSessionId = localStorage.getItem('news-session-id');
    if (storedSessionId) {
      // We have a previous session, load it up
      setSessionId(storedSessionId);
      loadSessionHistory(storedSessionId);
    } else {
      // No previous session, create a new one
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('news-session-id', newSessionId);
    }
  }, []);

  // Every time messages change, scroll to the bottom to show the latest
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a unique ID for this chat session
  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  // Load previous messages from this session
  const loadSessionHistory = async (sessionId) => {
    try {
      const history = await apiService.getSessionHistory(sessionId);
      if (history.messages && history.messages.length > 0) {
        // Debug: Log the loaded messages to see their structure
        console.log('Loaded messages from history:', history.messages);
        
        // Ensure all messages have valid timestamps and text content
        const messagesWithValidTimestamps = history.messages.map(message => ({
          ...message,
          timestamp: message.timestamp || new Date().toISOString(),
          text: message.text || message.content || message.message || 'Message content not available'
        }));
        
        console.log('Processed messages:', messagesWithValidTimestamps);
        setMessages(messagesWithValidTimestamps);
      }
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  };

  // Scroll the chat to the bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // This function handles when the user sends a message
  const handleSendMessage = async (messageText) => {
    // Don't send empty messages or if we're already processing one
    if (!messageText.trim() || isLoading) return;

    // Create the user's message object
    const userMessage = {
      id: Date.now(),
      text: messageText,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // Add the user's message to the chat immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Send the message to the backend and get the bot's response
      const response = await apiService.sendMessage(sessionId, messageText);
      
      // Add a realistic delay so it feels like the bot is thinking
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response.reply,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          citations: response.citations || []  // Include any sources the bot found
        };
        
        // Add the bot's response to the chat
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

    } catch (error) {
      // If something goes wrong, show an error message
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // This function clears the chat and starts fresh
  const handleResetSession = async () => {
    if (!sessionId) return;

    try {
      // Tell the backend to forget this session
      await apiService.resetSession(sessionId);
      // Clear all messages from the screen
      setMessages([]);
      
      // Create a brand new session ID
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('news-session-id', newSessionId);
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  };

  return (
    <div className="chat-screen">
      {/* Header with title and reset button */}
      <div className="chat-header">
        <h1>News Bot</h1>
        <p>Ask me anything about the latest news!</p>
        <ResetButton onReset={handleResetSession} />
      </div>
      
      {/* The main chat area where messages appear */}
      <div className="chat-messages">
        <MessageList messages={messages} />
        {/* Show typing animation when bot is thinking */}
        {isTyping && <TypingIndicator />}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area where user types messages */}
      <div className="chat-input">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading}  // Disable input while bot is responding
        />
      </div>
    </div>
  );
};

export default ChatScreen;
