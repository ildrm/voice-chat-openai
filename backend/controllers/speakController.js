const SpeechService = require('../services/speechService');

class SpeakController {
  static async generateSpeech(req, res) {
    try {
      const { text } = req.body;
      const audioUrl = await SpeechService.synthesize(text);
      res.json({ audioUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SpeakController;