const TranscriptionService = require('../services/transcriptionService');

class TranscribeController {
  static async transcribeAudio(req, res) {
    try {
      const audioBuffer = req.body;
      console.log('Received audio buffer, size:', audioBuffer.length, 'type:', req.get('Content-Type'));
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('No audio data received');
      }
      const transcription = await TranscriptionService.transcribe(audioBuffer);
      console.log('Transcription result:', transcription);
      res.json({ transcription });
    } catch (error) {
      console.error('Transcription error:', error.message, error.stack);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TranscribeController;