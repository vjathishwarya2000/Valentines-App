import React from 'react';
import { Heart } from 'lucide-react';

export default function ProgressBar({ current, total, score = null }) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Stats */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Question {current} of {total}
          </span>
        </div>
        {score !== null && (
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-pink-500" fill="currentColor" />
            <span className="text-sm font-bold text-pink-600">
              Score: {score}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-pink-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
        
        {/* Heart indicators */}
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{ left: `${(i / (total - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <Heart 
              size={20} 
              className={`transition-all duration-300 ${
                i < current 
                  ? 'text-pink-600 fill-current' 
                  : 'text-pink-300'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Percentage Display */}
      <div className="text-center mt-2">
        <span className="text-xs font-medium text-gray-500">
          {Math.round(percentage)}% Complete
        </span>
      </div>
    </div>
  );
}