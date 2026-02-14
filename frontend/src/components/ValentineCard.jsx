import React, { useRef, useState } from 'react';
import { Heart, Download, Sparkles, Star, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ValentineCard({ 
  couplePhoto, 
  creatorName, 
  partnerName, 
  customMessage,
  style = 'classic' 
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const styles = {
    classic: {
      bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #fecdd3 100%)',
      accent: '#be123c',
      secondaryAccent: '#ec4899',
      pattern: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(190, 18, 60, 0.1) 0%, transparent 50%)'
    },
    modern: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      accent: '#f43f5e',
      secondaryAccent: '#fb7185',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(244, 63, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(251, 113, 133, 0.1) 0%, transparent 50%)'
    },
    vintage: {
      bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
      accent: '#92400e',
      secondaryAccent: '#b45309',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(146, 64, 14, 0.03) 10px, rgba(146, 64, 14, 0.03) 20px)'
    },
    playful: {
      bg: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 50%, #a78bfa 100%)',
      accent: '#7c3aed',
      secondaryAccent: '#8b5cf6',
      pattern: 'radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
    },
    elegant: {
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
      accent: '#6b21a8',
      secondaryAccent: '#7c3aed',
      pattern: 'linear-gradient(0deg, transparent 24%, rgba(107, 33, 168, 0.05) 25%, rgba(107, 33, 168, 0.05) 26%, transparent 27%, transparent 74%, rgba(107, 33, 168, 0.05) 75%, rgba(107, 33, 168, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(107, 33, 168, 0.05) 25%, rgba(107, 33, 168, 0.05) 26%, transparent 27%, transparent 74%, rgba(107, 33, 168, 0.05) 75%, rgba(107, 33, 168, 0.05) 76%, transparent 77%, transparent)'
    }
  };

  const currentStyle = styles[style] || styles.classic;

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Get the exact dimensions of the card
      const rect = cardRef.current.getBoundingClientRect();
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // Higher quality - 3x resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: rect.width,
        height: rect.height,
        windowWidth: rect.width,
        windowHeight: rect.height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        // Preserve exact layout
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card-element]');
          if (clonedCard) {
            // Ensure exact sizing
            clonedCard.style.width = `${rect.width}px`;
            clonedCard.style.height = `${rect.height}px`;
            clonedCard.style.transform = 'none';
          }
        }
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `valentine-card-${creatorName.replace(/\s+/g, '-')}-${timestamp}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 'image/png', 1.0); // Maximum quality
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try right-clicking the card and selecting "Save image as..."');
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Main Card */}
      <div 
        ref={cardRef}
        data-card-element
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full max-w-3xl aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500"
        style={{ 
          background: currentStyle.bg,
          transform: isHovered ? 'scale(1.02) rotateY(2deg)' : 'scale(1)',
          boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        {/* Animated Background Pattern */}
        <div 
          className="absolute inset-0 opacity-50 transition-opacity duration-500"
          style={{ 
            backgroundImage: currentStyle.pattern,
            backgroundSize: '100px 100px',
            opacity: isHovered ? 0.7 : 0.5
          }}
        />

        {/* Floating Decorative Hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Heart
              key={i}
              size={Math.random() * 30 + 15}
              className="absolute animate-float-slow opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: currentStyle.accent,
                fill: currentStyle.accent,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-10 right-10 animate-pulse">
          <Sparkles size={40} style={{ color: currentStyle.secondaryAccent }} />
        </div>
        <div className="absolute bottom-10 left-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Star size={35} style={{ color: currentStyle.accent }} fill="currentColor" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col p-12">
          
          {/* Header with Animation */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="inline-flex items-center gap-3 mb-6">
              <Heart 
                size={48} 
                className="animate-heartbeat" 
                style={{ color: currentStyle.accent }} 
                fill="currentColor" 
              />
              <Sparkles size={36} className="animate-spin-slow" style={{ color: currentStyle.secondaryAccent }} />
              <Heart 
                size={48} 
                className="animate-heartbeat" 
                style={{ color: currentStyle.accent, animationDelay: '0.5s' }} 
                fill="currentColor" 
              />
            </div>
            
            <h1 
              className="text-6xl font-bold mb-4 drop-shadow-lg animate-slideInUp"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: currentStyle.accent,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Happy Valentine's Day
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="h-0.5 w-16 rounded-full"
                style={{ background: currentStyle.accent }}
              />
              <Heart size={16} style={{ color: currentStyle.secondaryAccent }} fill="currentColor" />
              <div 
                className="h-0.5 w-16 rounded-full"
                style={{ background: currentStyle.accent }}
              />
            </div>
            
            <p 
              className="text-2xl font-semibold mt-4 opacity-90 animate-fadeIn"
              style={{ 
                color: currentStyle.accent,
                animationDelay: '0.3s'
              }}
            >
              {creatorName} & {partnerName || 'My Love'}
            </p>
          </div>

          {/* Photo Section with Animated Border */}
          {couplePhoto && (
            <div className="flex-1 flex items-center justify-center mb-8 animate-zoomIn">
              <div className="relative group">
                {/* Animated Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"
                  style={{ background: currentStyle.secondaryAccent }}
                />
                
                {/* Rotating Border */}
                <div 
                  className="absolute inset-0 rounded-full p-1 animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, ${currentStyle.accent}, ${currentStyle.secondaryAccent}, ${currentStyle.accent})`,
                    animationDuration: '6s'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white" />
                </div>
                
                {/* Photo */}
                <img 
                  src={couplePhoto} 
                  alt="Couple" 
                  className="relative w-72 h-72 rounded-full object-cover border-8 border-white shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                  crossOrigin="anonymous"
                />
                
                {/* Corner Hearts */}
                <Heart 
                  size={32} 
                  className="absolute -top-2 -right-2 animate-bounce" 
                  style={{ color: currentStyle.accent }}
                  fill="currentColor"
                />
                <Heart 
                  size={28} 
                  className="absolute -bottom-2 -left-2 animate-bounce" 
                  style={{ color: currentStyle.secondaryAccent, animationDelay: '0.5s' }}
                  fill="currentColor"
                />
              </div>
            </div>
          )}

          {/* Message Box with Gradient Border */}
          <div className="relative animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {/* Gradient Border Effect */}
            <div 
              className="absolute -inset-0.5 rounded-2xl opacity-75 blur-sm"
              style={{
                background: `linear-gradient(135deg, ${currentStyle.accent}, ${currentStyle.secondaryAccent})`
              }}
            />
            
            {/* Message Content */}
            <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              {/* Decorative Quote Marks */}
              <div 
                className="absolute -top-4 left-6 text-6xl opacity-20 font-serif"
                style={{ color: currentStyle.accent }}
              >
                "
              </div>
              <div 
                className="absolute -bottom-2 right-6 text-6xl opacity-20 font-serif"
                style={{ color: currentStyle.accent }}
              >
                "
              </div>
              
              <p 
                className="text-xl text-center leading-relaxed relative z-10"
                style={{ 
                  fontFamily: "'Crimson Text', serif",
                  color: '#1f2937'
                }}
              >
                {customMessage || "You are my sunshine, my moonlight, and all my stars. Every moment with you is a treasure, and every day with you is a gift. I love you more than words can express. 💕"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center animate-fadeIn" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart size={14} style={{ color: currentStyle.accent }} fill="currentColor" />
              <Heart size={18} style={{ color: currentStyle.secondaryAccent }} fill="currentColor" />
              <Heart size={14} style={{ color: currentStyle.accent }} fill="currentColor" />
            </div>
            <p 
              className="text-sm opacity-70"
              style={{ color: currentStyle.accent }}
            >
              Created with love on {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Download Button */}
      <button
        onClick={downloadCard}
        disabled={isDownloading}
        className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center gap-3">
          {isDownloading ? (
            <>
              <Loader size={24} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={24} className="group-hover:animate-bounce" />
              Download Card
              <Sparkles size={20} className="group-hover:animate-spin" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}