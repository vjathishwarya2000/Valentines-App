import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer({ track = 'romantic_theme', autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [audio] = useState(new Audio());

  useEffect(() => {
    // Set audio source (will fail silently if file doesn't exist)
    audio.src = `/music/${track}.mp3`;
    audio.loop = true;
    audio.volume = volume;
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [track]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.log('Audio play prevented by browser - user must enable');
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl p-4 z-50 flex items-center gap-3">
      <button 
        onClick={togglePlay}
        className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white hover:scale-110 transition-transform"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      
      <div className="flex items-center gap-2">
        <Music size={16} className="text-pink-500" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => setVolume(e.target.value / 100)}
          className="w-20 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volume * 100}%, #fecdd3 ${volume * 100}%, #fecdd3 100%)`
          }}
        />
      </div>
    </div>
  );
}