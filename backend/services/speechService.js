class SpeechService {
  async synthesize(text) {
    // Using Web Speech API for simplicity (server returns text to be synthesized client-side)
    return text;
  }
}

module.exports = new SpeechService();