import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ArrowRight, Music, Gift } from 'lucide-react';
import FloatingHearts from '../components/FloatingHearts';

export default function LandingPage({ onNavigate }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCreateClick = () => {
    console.log('Create Quiz clicked');
    onNavigate('create');
  };

  const handlePlayClick = () => {
    console.log('Join Quiz clicked');
    onNavigate('play');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden">
      <FloatingHearts />
      
      {/* Animated Background Elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo/Title */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <Heart size={48} className="text-pink-500 animate-pulse" fill="currentColor" />
            <Sparkles size={40} className="text-purple-500 animate-spin-slow" />
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Love Quiz
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
             style={{ fontFamily: "'Crimson Text', serif" }}>
            Create a magical Valentine's experience for your special someone.
            <br />
            Share memories, test knowledge, and celebrate your love story. 💕
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-pink-100">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <Heart size={24} className="text-white" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Questions</h3>
            <p className="text-gray-600 text-sm">Create personalized questions about your relationship</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
              <Music size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Background Music</h3>
            <p className="text-gray-600 text-sm">Add romantic music to set the perfect mood</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-rose-100">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
              <Gift size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Valentine Card</h3>
            <p className="text-gray-600 text-sm">Generate a beautiful digital Valentine's card</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <button
            onClick={handleCreateClick}
            className="group relative flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create Quiz
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={handlePlayClick}
            className="group relative flex-1 bg-white text-pink-600 px-8 py-6 rounded-2xl font-bold text-lg shadow-xl border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              Join Quiz
              <Heart size={20} className="group-hover:fill-current transition-all" />
            </span>
          </button>
        </div>

        {/* Decorative Text */}
        <p className="mt-12 text-sm text-gray-500 italic">
          Made with ❤️ for those who believe in love
        </p>
      </div>
    </div>
  );
}