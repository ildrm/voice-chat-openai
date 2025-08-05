import React, { useState, useRef, useEffect } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder';

function VoiceChat() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Callback function to handle recorded audio data
  async function handleAudioData(blob) {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      console.log('Processing audio, size:', blob.size, 'type:', blob.type);

      // Send audio blob to the backend for transcription
      const transcribeRes = await fetch('http://localhost:5000/api/transcribe', {
        method: 'POST',
        body: blob,
        headers: { 'Content-Type': 'audio/webm' },
      });

      if (!transcribeRes.ok) {
        const errorText = await transcribeRes.text();
        throw new Error(`Transcription failed: ${transcribeRes.status} ${errorText}`);
      }

      const { transcription } = await transcribeRes.json();
      console.log('Transcription:', transcription);

      if (!transcription || transcription.trim() === '') {
        throw new Error('Empty transcription. Please try speaking again.');
      }

      // Add user's transcribed message to the chat
      const newMessages = [...messages, { role: 'user', content: transcription }];
      setMessages(newMessages);

      // Send the transcription to the backend to get an AI response
      const respondRes = await fetch('http://localhost:5000/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription, conversationHistory: newMessages }),
      });

      if (!respondRes.ok) {
        throw new Error(`Response generation failed: ${respondRes.statusText}`);
      }

      const { response } = await respondRes.json();
      console.log('AI Response:', response);

      // Add AI's response to the chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Use browser's speech synthesis to speak the AI's response
      const speech = new SpeechSynthesisUtterance(response);
      speech.lang = 'en-US';
      speech.onend = () => console.log('Speech playback completed');
      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error('Error in handleAudioData:', err);
      setErrorMessage(`Error processing audio: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const { start, stop, isInitialized, error: recorderError, clearError } = useMediaRecorder(handleAudioData);
  const messagesEndRef = useRef(null);

  // Toggles recording on/off
  const handleRecord = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      if (stop()) {
        setIsRecording(false);
        console.log('Stop recording triggered');
      }
    } else {
      if (start()) {
        setIsRecording(true);
        setErrorMessage('');
        clearError(); // Clear any previous recorder errors
        console.log('Start recording triggered');
      } else {
        // This case might be hit if initialization is not complete yet.
        // The recorderError effect will handle more specific errors.
        setErrorMessage('Could not start recording.');
      }
    }
  };

  // Resets the conversation
  const handleReset = () => {
    setMessages([]);
    setIsRecording(false);
    setIsProcessing(false);
    setErrorMessage('');
    window.speechSynthesis.cancel();
    console.log('Conversation reset');
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle errors from the media recorder hook
  useEffect(() => {
    if (recorderError) {
      setErrorMessage(recorderError);
      setIsRecording(false); // Ensure recording state is reset on error
    }
  }, [recorderError]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Voice AI Chat</h1>
      
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {messages.length === 0 && !isProcessing && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Press "Start Recording" to begin the conversation.
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg max-w-md break-words ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-auto' 
                : 'bg-green-100 mr-auto'
            }`}
          >
            <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handleRecord}
          className={`px-6 py-3 rounded-full text-white font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          } ${
            !isInitialized || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isInitialized || isProcessing}
        >
          {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={isProcessing}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default VoiceChat;
