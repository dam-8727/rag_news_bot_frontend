// This is where we connect to our backend API
const API_BASE_URL = process.env.REACT_APP_API_URL;

// This class handles all communication with the backend
class ApiService {
  // Send a message to the bot and get a response
  async sendMessage(sessionId, message) {
    try {
      // Make a POST request to the chat endpoint
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, message }),  // Send session ID and user message
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Return the bot's response as JSON
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get the chat history for a specific session
  async getSessionHistory(sessionId) {
    try {
      // Make a GET request to fetch previous messages
      const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}/history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching session history:', error);
      throw error;
    }
  }

  // Clear all messages from a session (start fresh)
  async resetSession(sessionId) {
    try {
      // Make a DELETE request to clear the session
      const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error resetting session:', error);
      throw error;
    }
  }

  // Check if the backend server is running and healthy
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;  // Returns true if server is healthy
    } catch (error) {
      console.error('Health check failed:', error);
      return false;  // Server is not responding
    }
  }
}

// Export a single instance of the API service (singleton pattern)
export default new ApiService();
