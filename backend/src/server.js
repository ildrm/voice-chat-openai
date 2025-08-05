const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const transcribeController = require('../controllers/transcribeController.js');
const respondController = require('../controllers/respondController.js');
const speakController = require('../controllers/speakController.js');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: ['audio/webm', 'audio/mp4'], limit: '10mb' }));

app.post('/api/transcribe', transcribeController.transcribeAudio);
app.post('/api/respond', respondController.generateResponse);
app.post('/api/speak', speakController.generateSpeech);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));