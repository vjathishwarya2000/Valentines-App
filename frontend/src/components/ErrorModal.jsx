import React, { useEffect, useState } from 'react';
import { AlertCircle, X, Heart, RefreshCw } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, title, message, type = 'error', onAction }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (onAction) {
        onAction(); // Execute additional action (like redirect)
      }
    }, 300);
  };

  if (!isOpen) return null;

  const colors = {
    error: {
      bg: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      button: 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
      accent: '#ef4444'
    },
    warning: {
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      button: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      accent: '#f59e0b'
    },
    info: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      button: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      accent: '#3b82f6'
    }
  };

  const theme = colors[type] || colors.error;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`relative bg-gradient-to-br ${theme.bg} rounded-3xl shadow-2xl max-w-md w-full border-2 ${theme.border} transform transition-all duration-500 ${
          isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <Heart
                key={i}
                size={40}
                className="absolute opacity-20 animate-float-slow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  color: theme.accent
                }}
                fill="currentColor"
              />
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200 hover:rotate-90 z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-8 pt-12">
          {/* Icon with animation */}
          <div className="flex justify-center mb-6">
            <div className={`relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg animate-bounce-slow`}>
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: theme.accent }}
              />
              {type === 'error' ? (
                <AlertCircle size={48} className={theme.icon} />
              ) : (
                <RefreshCw size={48} className={theme.icon} />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 animate-slideInUp"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>

          {/* Message */}
          <p className="text-lg text-center text-gray-700 leading-relaxed mb-8 animate-fadeIn"
             style={{ 
               fontFamily: "'Crimson Text', serif",
               animationDelay: '0.2s'
             }}>
            {message}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            <Heart size={16} className={theme.icon} fill="currentColor" />
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg bg-gradient-to-r ${theme.button} transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
          >
            <RefreshCw size={20} />
            Try Different Code
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-b-3xl" />
      </div>
    </div>
  );
}