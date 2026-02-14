import React, { useState } from 'react';
import { Heart, Trophy, Star, Download, Home } from 'lucide-react';
import ValentineCard from '../components/ValentineCard';
import ConfettiEffect from '../components/ConfettiEffect';
import FloatingHearts from '../components/FloatingHearts';

export default function ResultsPage({ results, onHome }) {
  const { quiz, score, totalQuestions, playerName } = results;
  const [showCard, setShowCard] = useState(false);
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect! You know everything! 💕";
    if (percentage >= 80) return "Amazing! You know me so well! 🌟";
    if (percentage >= 60) return "Great job! We're getting there! 💝";
    if (percentage >= 40) return "Not bad! We'll learn more together! 🌸";
    return "We have so much to discover! 💫";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "from-green-400 to-emerald-500";
    if (percentage >= 60) return "from-blue-400 to-cyan-500";
    if (percentage >= 40) return "from-purple-400 to-pink-500";
    return "from-orange-400 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 relative overflow-hidden">
      <FloatingHearts />
      <ConfettiEffect active={percentage >= 70} duration={4000} />
      
      <div className="max-w-4xl mx-auto pt-10 relative z-10">
        {!showCard ? (
          <>
            {/* Score Display */}
            <div className="text-center mb-10 animate-fadeInUp">
              <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r ${getScoreColor()} rounded-full mb-6 shadow-2xl animate-bounce-slow`}>
                <Trophy size={64} className="text-white" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Quiz Complete!
              </h1>
              
              <p className="text-2xl text-gray-600 mb-2">
                Well done, {playerName}! 🎉
              </p>
              
              <p className="text-xl text-gray-500 italic">
                {getScoreMessage()}
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Total Score */}
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
                  <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-2">
                    {score}/{totalQuestions}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Questions Correct</p>
                </div>

                {/* Percentage */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                    {percentage}%
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Success Rate</p>
                </div>

                {/* Stars */}
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={28}
                        className={i < Math.ceil(percentage / 20) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {Math.ceil(percentage / 20)} / 5 Stars
                  </p>
                </div>
              </div>

              {/* Message from Creator */}
              {quiz.loveMessage && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-6 border-2 border-pink-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart size={20} className="text-pink-500" fill="currentColor" />
                    <h3 className="font-bold text-gray-800">Message from {quiz.creatorName}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{quiz.loveMessage}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {quiz.valentineCard?.enabled && (
                  <button
                    onClick={() => setShowCard(true)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Heart size={20} fill="currentColor" />
                    See Your Valentine Card
                  </button>
                )}
                
                <button
                  onClick={onHome}
                  className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Back to Home
                </button>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💝 Fun Stats
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Quiz Theme</p>
                    <p className="text-sm text-gray-600 capitalize">{quiz.theme} style</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Music</p>
                    <p className="text-sm text-gray-600 capitalize">{quiz.backgroundMusic?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl">
                  <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">❓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Total Questions</p>
                    <p className="text-sm text-gray-600">{totalQuestions} questions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Created By</p>
                    <p className="text-sm text-gray-600">{quiz.creatorName}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Valentine Card Display */}
            <button
              onClick={() => setShowCard(false)}
              className="mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Heart size={20} className="text-pink-500" />
              <span className="font-medium text-gray-700">Back to Results</span>
            </button>

            <div className="animate-fadeIn">
              <ValentineCard
                couplePhoto={quiz.photoUrl}
                creatorName={quiz.creatorName}
                partnerName={quiz.partnerName || playerName}
                customMessage={quiz.valentineCard?.customMessage || quiz.loveMessage}
                style={quiz.valentineCard?.style || quiz.theme}
              />
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onHome}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
              >
                <Home size={20} />
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}