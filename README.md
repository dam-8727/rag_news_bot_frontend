# News Bot Frontend

A modern React frontend for the News Bot application that provides AI-powered news assistance with real-time chat capabilities.

## Features

- ** Interactive Chat Interface**: Clean, modern chat UI with message history and smooth scrolling
- **AI-Powered Responses**: Send messages and receive intelligent news-related responses
- ** Session Management**: Persistent chat sessions with localStorage and reset functionality
- ** Typing Indicators**: Visual feedback with animated dots when the bot is responding
- ** Citation Support**: Display source citations with clickable links to original news articles
- ** Responsive Design**: Mobile-first design that works seamlessly on all devices
- **🎨 Modern UI**: Beautiful gradient design with smooth animations and glass-morphism effects
- **⚡ Auto-resizing Input**: Smart textarea that grows with your message
- **🔄 Session Reset**: One-click conversation reset with confirmation
- **💾 Persistent History**: Chat history persists across browser sessions

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **Backend server** running on port 3000 (see backend documentation)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

> **Note**: The app will automatically open in your default browser. If it doesn't, manually navigate to `http://localhost:3002`. The frontend runs on port 3002 while the backend runs on port 3000.




## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production

## Project Structure

```
src/
├── components/
│   ├── ChatScreen.js          # Main chat interface
│   ├── ChatScreen.scss        # Chat screen styles
│   ├── MessageList.js         # Message list component
│   ├── MessageList.scss       # Message list styles
│   ├── Message.js             # Individual message component
│   ├── Message.scss           # Message styles
│   ├── MessageInput.js        # Message input form
│   ├── MessageInput.scss      # Input styles
│   ├── ResetButton.js         # Session reset button
│   ├── ResetButton.scss       # Reset button styles
│   ├── TypingIndicator.js     # Typing animation
│   └── TypingIndicator.scss   # Typing indicator styles
├── services/
│   └── api.js                 # API service for backend communication
├── App.js                     # Main app component
├── App.scss                   # App styles
├── index.js                   # App entry point
└── index.scss                 # Global styles
```

## API Integration & Communication

The frontend communicates with the backend through a RESTful API using the `ApiService` class. Here's how the communication flow works:

### API Service Architecture

The `ApiService` class (`src/services/api.js`) handles all backend communication with the following methods:

#### 1. **Message Sending** (`sendMessage`)
```javascript
// POST /api/chat
{
  "sessionId": "session_abc123_1234567890",
  "message": "What's the latest news about AI?"
}
```
- **Request**: Sends user message and session ID to backend
- **Response**: Returns bot reply with optional citations
- **Error Handling**: Catches network errors and HTTP errors, throws descriptive error messages

#### 2. **Session History** (`getSessionHistory`)
```javascript
// GET /api/session/{sessionId}/history
```
- **Request**: Fetches previous messages for a specific session
- **Response**: Returns array of historical messages
- **Usage**: Loads chat history when user returns to the app

#### 3. **Session Reset** (`resetSession`)
```javascript
// DELETE /api/session/{sessionId}
```
- **Request**: Clears all messages for a session
- **Response**: Confirmation of session reset
- **Usage**: "Start fresh" functionality

#### 4. **Health Check** (`checkHealth`)
```javascript
// GET /health
```
- **Request**: Checks if backend server is running
- **Response**: Boolean indicating server status
- **Usage**: Monitoring backend availability

### Communication Flow

#### 1. **Initial Load**
```javascript
// ChatScreen.js - useEffect on component mount
1. Check localStorage for existing sessionId
2. If found: loadSessionHistory(sessionId)
3. If not found: generate new sessionId and store in localStorage
```

#### 2. **Sending Messages**
```javascript
// ChatScreen.js - handleSendMessage function
1. User types message and hits send
2. Create user message object with timestamp
3. Add user message to UI immediately (optimistic update)
4. Set loading states (isLoading, isTyping)
5. Call apiService.sendMessage(sessionId, messageText)
6. Wait for response with artificial delay (1-3 seconds)
7. Create bot message object with response data
8. Add bot message to UI
9. Clear loading states
```

#### 3. **Response Handling**
```javascript
// Response structure from backend
{
  "reply": "Based on recent news, AI developments...",
  "citations": [
    {
      "title": "AI Breakthrough Article",
      "url": "https://example.com/article",
      "score": 0.95
    }
  ]
}
```

#### 4. **Error Handling**
```javascript
// Three levels of error handling:
1. Network errors (connection issues)
2. HTTP errors (4xx, 5xx status codes)
3. Application errors (malformed responses)

// Error response in UI:
{
  "text": "Sorry, I encountered an error. Please try again.",
  "role": "assistant",
  "isError": true
}
```

### Response Processing

#### 1. **Message Display** (`Message.js`)
- **Citation Parsing**: Automatically detects `[1]`, `[2]` patterns in bot responses
- **Clickable Citations**: Makes citation numbers clickable with scroll-to-source functionality
- **Source Links**: Displays citations with titles, URLs, and relevance scores
- **Timestamp Formatting**: Converts ISO timestamps to readable time format

#### 2. **UI State Management**
- **Loading States**: `isLoading` prevents multiple simultaneous requests
- **Typing Indicator**: `isTyping` shows animated dots during response processing
- **Auto-scroll**: Automatically scrolls to bottom when new messages arrive
- **Input Disabling**: Prevents new messages while processing

#### 3. **Session Persistence**
- **localStorage**: Stores sessionId across browser sessions
- **Message History**: Loads previous conversation on app restart
- **Session Reset**: Clears both UI and backend session data

### Configuration

```javascript
// Environment-based API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

- **Development**: Defaults to `http://localhost:3000`
- **Production**: Set via `REACT_APP_API_URL` environment variable
- **Health Monitoring**: Built-in server status checking

### Error Recovery

1. **Network Failures**: Automatic retry prompts and error messages
2. **Session Loss**: Automatic session regeneration
3. **Backend Downtime**: Graceful degradation with error notifications
4. **Malformed Responses**: Safe fallbacks to prevent UI crashes

## Features in Detail

### Chat Interface
- Displays conversation history with user and bot messages
- Different styling for user vs bot messages
- Timestamps for each message
- Error handling for failed requests

### Session Management
- Automatic session ID generation and storage
- Session persistence across browser refreshes
- Reset functionality to start a new conversation

### Typing Indicators
- Visual feedback when the bot is processing a response
- Animated dots to indicate activity
- Simulated typing delay for better UX

### Citation Support
- Display source citations from the RAG system
- Clickable links to original news articles
- Relevance scores for each citation

### Responsive Design
- Mobile-friendly layout
- Adaptive message bubbles
- Touch-friendly input controls

## Styling

The application uses SCSS for styling with:
- CSS Grid and Flexbox for layout
- CSS custom properties for theming
- Smooth animations and transitions
- Modern gradient backgrounds
- Glass-morphism effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
