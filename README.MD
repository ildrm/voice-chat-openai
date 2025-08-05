# Voice-to-Voice AI Agent

## Overview
Voice-to-Voice AI Agent is a web application that allows users to interact with an AI through voice commands. Users can speak to the app, which transcribes their speech, processes it, and responds with both text and spoken output. The application provides a simple and intuitive interface for seamless voice-based conversations, making it ideal for hands-free interaction or accessibility purposes.

## Features
- **Voice Input**: Speak directly to the app, and it will transcribe your speech in real-time.
- **AI Responses**: Receive intelligent text and voice responses from the AI based on your input.
- **Conversation History**: View a history of your conversation with the AI in an easy-to-read chat format.
- **Reset Functionality**: Clear the conversation history to start a new session.

## Prerequisites
This project was tested in an environment with the following versions:
- Node.js: v22.18.0
- npm: 11.5.2

Ensure you have these versions or compatible ones installed to run the application smoothly.

## Installation
1. Clone the repository to your local machine.
2. Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables by creating a `.env` file in the `backend` directory with the required configuration (e.g., API keys).

## Usage
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
2. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`.
4. Click the "Start Recording" button, speak your query, and click "Stop Recording" to receive the AI's response.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or bug fixes.

## License
This project is licensed under the MIT License.