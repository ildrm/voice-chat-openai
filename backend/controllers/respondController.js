const ResponseService = require('../services/responseService');

class RespondController {
  static async generateResponse(req, res) {
    try {
      const { text, conversationHistory } = req.body;
      const response = await ResponseService.generate(text, conversationHistory);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RespondController;