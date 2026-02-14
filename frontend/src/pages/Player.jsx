import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Lock } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import FloatingHearts from '../components/FloatingHearts';

export default function Player({ onBack, onComplete }) {
  const [code, setCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check URL for room code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      setCode(roomParam);
    }
  }, []);

  const loadQuiz = async (enteredCode) => {
    if (!enteredCode) {
      alert('Please enter a room code!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/quiz/${enteredCode}`);
      
      if (!res.ok) {
        alert('Room not found! Please check the code.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setQuiz(data);
      setLoading(false);
    } catch (err) {
      console.error('Load failed:', err);
      alert('Could not connect to server!');
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === quiz.questions[step].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (step < quiz.questions.length - 1) {
        setStep(step + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz completed
        saveCompletion();
      }
    }, 1500);
  };

  const saveCompletion = async () => {
    try {
      await fetch(`http://localhost:5005/api/quiz/${quiz.roomCode}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          score: score + (selectedAnswer === quiz.questions[step].correctAnswer ? 1 : 0)
        })
      });
    } catch (err) {
      console.error('Failed to save completion:', err);
    }

    setTimeout(() => {
      onComplete({
        quiz,
        score: score + (selectedAnswer === quiz.questions[step].correctAnswer ? 1 : 0),
        totalQuestions: quiz.questions.length,
        playerName
      });
    }, 1500);
  };

  // Entry Screen
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
        <FloatingHearts />
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Back</span>
        </button>

        <div className="relative z-10 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full mb-6 animate-pulse">
              <Lock size={36} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Enter Quiz Room
            </h1>
            <p className="text-gray-600">Enter the secret code to begin</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                placeholder="Enter secret code"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors text-center text-xl tracking-wider font-bold"
              />
            </div>

            <button
              onClick={() => loadQuiz(code)}
              disabled={!code || !playerName || loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <Heart size={20} fill="currentColor" />
                  Join Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const currentQuestion = quiz.questions[step];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 relative overflow-hidden">
      <FloatingHearts />
      
      <div className="max-w-3xl mx-auto pt-10 relative z-10">
        <ProgressBar 
          current={step + 1} 
          total={quiz.questions.length}
          score={score}
        />

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Question */}
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full mb-4">
              <span className="text-sm font-bold text-pink-600">
                Question {step + 1} of {quiz.questions.length}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight"
                style={{ fontFamily: "'Crimson Text', serif" }}>
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.allOptions.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isThisCorrect = option === currentQuestion.correctAnswer;
              
              let buttonClass = "w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 font-medium text-lg ";
              
              if (showFeedback) {
                if (isSelected && isCorrect) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800 scale-105";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800";
                } else if (isThisCorrect) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else {
                  buttonClass += "border-gray-200 text-gray-400";
                }
              } else {
                buttonClass += "border-pink-200 hover:border-pink-400 hover:bg-pink-50 hover:scale-105";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(option)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      showFeedback && isThisCorrect 
                        ? 'bg-green-500 text-white' 
                        : showFeedback && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showFeedback && isThisCorrect && (
                      <span className="text-2xl">✓</span>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <span className="text-2xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className={`mt-6 p-6 rounded-2xl text-center animate-fadeIn ${
              isCorrect 
                ? 'bg-green-100 border-2 border-green-300' 
                : 'bg-orange-100 border-2 border-orange-300'
            }`}>
              <p className={`text-xl font-bold ${
                isCorrect ? 'text-green-700' : 'text-orange-700'
              }`}>
                {isCorrect ? '🎉 Correct! Great job!' : '💭 Not quite, but nice try!'}
              </p>
            </div>
          )}
        </div>

        {/* Quiz Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Created by {quiz.creatorName} with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}