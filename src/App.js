import React from 'react';
import ChatScreen from './components/ChatScreen';
import './App.scss';

// This is the main App component - the root of our entire application
function App() {
  return (
    <div className="app">
      {/* The ChatScreen component handles everything - it's our main chat interface */}
      <ChatScreen />
    </div>
  );
}

export default App;
