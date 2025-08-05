import { useRef, useEffect, useState } from 'react';

/**
 * A custom hook for handling audio recording using the MediaRecorder API.
 * @param {function(Blob): void} onDataAvailable - Callback function to handle the recorded audio data.
 * @returns {{
 * start: () => boolean,
 * stop: () => boolean,
 * isInitialized: boolean,
 * error: string | null,
 * clearError: () => void
 * }}
 */
function useMediaRecorder(onDataAvailable) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Use a ref to hold the latest onDataAvailable callback.
  // This avoids re-running the main effect when the parent component re-renders and the callback function identity changes.
  const onDataAvailableRef = useRef(onDataAvailable);
  useEffect(() => {
    onDataAvailableRef.current = onDataAvailable;
  }, [onDataAvailable]);

  // Effect to get user media and set up the recorder on component mount.
  useEffect(() => {
    const initializeRecorder = async () => {
      setError(null);
      console.log('Initializing MediaRecorder...');
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        console.log('Media stream obtained');

        // Create a new MediaRecorder instance with the stream
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        // Event handler for when audio data is available
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log('Audio data available, size:', event.data.size);
            // Use the ref to call the latest callback.
            onDataAvailableRef.current(event.data);
          } else {
            console.warn('No audio data recorded');
            setError('No audio data recorded. Your recording might be too short or the microphone is not working.');
          }
        };

        // Event handler for when recording starts
        mediaRecorder.onstart = () => {
          console.log('MediaRecorder started');
        };

        // Event handler for when recording stops
        mediaRecorder.onstop = () => {
          console.log('MediaRecorder stopped');
        };

        // Event handler for any recording errors
        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event.error);
          setError(`Recording error: ${event.error.message}`);
        };

        setIsInitialized(true);
        console.log('MediaRecorder initialized');
      } catch (err) {
        console.error('Error during media initialization:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No microphone found. Please ensure a microphone is connected.');
        } else {
          setError(`Could not access microphone: ${err.message}`);
        }
      }
    };

    initializeRecorder();

    // Cleanup function to run when the component unmounts
    return () => {
      console.log('Cleaning up MediaRecorder and stream...');
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // This effect correctly has no dependencies and runs only once.
  }, []);

  /**
   * Starts the audio recording.
   * @returns {boolean} - True if recording started successfully, false otherwise.
   */
  const start = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'recording') {
      setError(null); // Clear previous errors on new start
      mediaRecorderRef.current.start();
      return true;
    }
    console.warn('Cannot start recording: MediaRecorder not initialized or already recording');
    return false;
  };

  /**
   * Stops the audio recording.
   * @returns {boolean} - True if recording was stopped successfully, false otherwise.
   */
  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      return true;
    }
    console.warn('Cannot stop recording: MediaRecorder not initialized or not recording');
    return false;
  };

  return {
    start,
    stop,
    isInitialized,
    error,
    clearError: () => setError(null),
  };
}

export default useMediaRecorder;
