const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  roomCode: { 
    type: String, 
    unique: true, 
    required: true 
  },
  creatorName: { 
    type: String, 
    required: true 
  },
  partnerName: String,
  photoUrl: String, // Base64 or URL
  backgroundMusic: {
    type: String,
    default: 'romantic_theme'
  },
  theme: {
    type: String,
    enum: ['classic', 'modern', 'vintage', 'playful', 'elegant'],
    default: 'classic'
  },
  loveMessage: {
    type: String,
    default: ''
  },
  valentineCard: {
    enabled: { type: Boolean, default: false },
    style: { type: String, default: 'classic' },
    customMessage: { type: String, default: '' }
  },
  questions: [{
    questionText: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    allOptions: [String]
  }],
  completedBy: [{
    name: String,
    score: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);