import React, { useEffect, useState } from 'react';

export default function ConfettiEffect({ active = false, duration = 3000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#ec4899', '#f43f5e', '#be123c', '#fbbf24', '#a855f7', '#8b5cf6'];
      const shapes = ['circle', 'square', 'triangle'];
      
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 12
      }));
      
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.left}%`,
            top: '-10%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `confettiFall ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: particle.color,
              borderRadius: particle.shape === 'circle' ? '50%' : '0',
              clipPath: particle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }}
          />
        </div>
      ))}
    </div>
  );
}