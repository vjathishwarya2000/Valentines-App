import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 20 + Math.random() * 30
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: '-10%',
            animation: `floatHeart ${heart.duration}s linear infinite`,
            animationDelay: `${heart.delay}s`
          }}
        >
          <Heart 
            size={heart.size} 
            className="text-pink-200 opacity-40"
            fill="currentColor"
          />
        </div>
      ))}
    </div>
  );
}