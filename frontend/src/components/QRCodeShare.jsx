import React, { useState, useEffect, useRef } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function QRCodeShare({ roomCode, creatorName }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the actual URL that can be accessed from other devices
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    let baseUrl;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      baseUrl = `${protocol}//${hostname}:${port}`;
    } else {
      baseUrl = window.location.origin;
    }
    
    const url = `${baseUrl}?room=${roomCode}`;
    setShareUrl(url);

    // Generate QR Code
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#be123c',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [roomCode]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `💕 ${creatorName}'s Love Quiz`,
          text: `I created a special Valentine's quiz for you! Use code: ${roomCode}`,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share failed:', err);
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `valentine-quiz-qr-${roomCode}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
        Share Your Love Quiz! 💝
      </h2>
      
      {/* QR Code */}
      <div className="flex justify-center mb-6 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <canvas 
            ref={canvasRef}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Room Code Display */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-600 text-center mb-2">Room Code</p>
        <p className="text-2xl font-bold text-center text-rose-600 tracking-wider">
          {roomCode}
        </p>
      </div>

      {/* Share Link Display */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 break-all">
        <p className="text-xs text-gray-500 mb-1">Share Link:</p>
        <p className="text-sm text-gray-700 font-mono">{shareUrl}</p>
      </div>

      {/* Local Network Note */}
      {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>📱 For Other Devices:</strong>
            <br />
            Replace 'localhost' with your computer's IP address.
            <br />
            <span className="text-xs">Example: <code className="bg-yellow-100 px-1 rounded">http://192.168.1.100:5173?room={roomCode}</code></span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={copyLink}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl hover:scale-105 transition-transform"
        >
          {copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-pink-600" />}
          <span className="text-xs font-medium text-gray-700">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>

        <button
          onClick={downloadQR}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl hover:scale-105 transition-transform"
        >
          <Download size={24} className="text-rose-600" />
          <span className="text-xs font-medium text-gray-700">Download</span>
        </button>

        <button
          onClick={shareNative}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl hover:scale-105 transition-transform"
        >
          <Share2 size={24} className="text-purple-600" />
          <span className="text-xs font-medium text-gray-700">Share</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Send this to your special someone! 💕
      </p>
    </div>
  );
}