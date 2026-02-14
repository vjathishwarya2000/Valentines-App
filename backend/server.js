const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://valentines-app2026.netlify.app', 
    /\.netlify\.app$/  
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const Quiz = require('./models/Quiz');

// Health Check Route - MUST BE FIRST
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    message: '💕 Valentine Quiz API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      createQuiz: 'POST /api/quiz/create',
      getQuiz: 'GET /api/quiz/:code',
      complete: 'POST /api/quiz/:code/complete',
      stats: 'GET /api/quiz/:code/stats'
    }
  });
});

// Create a new quiz
app.post('/api/quiz/create', async (req, res) => {
  try {
    console.log('📥 Received quiz data:', {
      roomCode: req.body.roomCode,
      creatorName: req.body.creatorName,
      questionsCount: req.body.questions?.length
    });

    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    
    console.log('✅ Quiz saved successfully:', newQuiz.roomCode);
    
    res.status(201).json({ 
      success: true, 
      roomCode: newQuiz.roomCode,
      message: 'Quiz created successfully! 💕'
    });
  } catch (err) {
    console.error('❌ Error creating quiz:', err.message);
    
    // Handle duplicate room code
    if (err.code === 11000) {
      return res.status(200).json({
        success: false, 
        error: 'Room code already exists',
        message: `The room code "${req.body.roomCode}" is already being used by another lovely couple. Please choose a different code to create your unique love quiz!`
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(200).json({
        success: false, 
        error: 'Validation failed',
        message: 'Missing required fields: ' + Object.keys(err.errors).join(', ')
      });
    }
    
    // Other errors
    res.status(200).json({
      success: false, 
      error: err.message,
      message: 'An error occurred while saving your quiz. Please try again!'
    });
  }
});

// Get quiz by room code
app.get('/api/quiz/:code', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ roomCode: req.params.code });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Room not found. Please check the code! 💔" 
      });
    }
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Update quiz completion
app.post('/api/quiz/:code/complete', async (req, res) => {
  try {
    const { name, score } = req.body;
    const quiz = await Quiz.findOne({ roomCode: req.params.code });
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.completedBy.push({ name, score });
    await quiz.save();
    
    res.json({ 
      success: true, 
      message: 'Score saved! 💝' 
    });
  } catch (err) {
    console.error('Error saving completion:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get quiz statistics
app.get('/api/quiz/:code/stats', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ roomCode: req.params.code });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const stats = {
      totalCompletions: quiz.completedBy.length,
      averageScore: quiz.completedBy.length > 0 
        ? quiz.completedBy.reduce((sum, c) => sum + c.score, 0) / quiz.completedBy.length 
        : 0,
      completions: quiz.completedBy
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler - MUST BE LAST
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'POST /api/quiz/create',
      'GET /api/quiz/:code',
      'POST /api/quiz/:code/complete',
      'GET /api/quiz/:code/stats'
    ]
  });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🎵 Server running on port ${PORT}`);
  console.log(`💕 Backend is ready for love!`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});