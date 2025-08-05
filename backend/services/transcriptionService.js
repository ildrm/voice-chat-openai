const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

class TranscriptionService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribe(audioBuffer) {
    try {
      console.log('Starting transcription, buffer size:', audioBuffer.length);
      if (!(audioBuffer instanceof Buffer)) {
        throw new Error('Invalid audio buffer: Expected Buffer object');
      }
      if (audioBuffer.length < 500) {
        throw new Error('Audio buffer too small (< 500 bytes). Please record for at least 1 second.');
      }
      const audioFile = new File([audioBuffer], 'recording.webm', { type: 'audio/webm' });
      console.log('Created File object:', audioFile.name, audioFile.size, audioFile.type);

      const response = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'text',
      });
      console.log('Whisper API response:', response);
      return response;
    } catch (error) {
      console.error('Whisper API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      });
      throw new Error(`Transcription failed: ${error.message}${error.response?.data ? ' - ' + JSON.stringify(error.response.data) : ''}`);
    }
  }
}

module.exports = new TranscriptionService();