const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

class ResponseService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generate(text, conversationHistory = []) {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: text }
      ];
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return response.choices[0].message.content;
    } catch (error) {
      throw new Error('Response generation failed: ' + error.message);
    }
  }
}

module.exports = new ResponseService();