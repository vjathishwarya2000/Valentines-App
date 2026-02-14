import React, { useState } from 'react';
import { Heart, Plus, Trash2, Image, Music, Wand2, Save, ArrowLeft } from 'lucide-react';
import QRCodeShare from '../components/QRCodeShare';
import ValentineCard from '../components/ValentineCard';
import FloatingHearts from '../components/FloatingHearts';
import ErrorModal from '../components/ErrorModal';

export default function Creator({ onBack }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Questions, 3: Card, 4: Share
  const [formData, setFormData] = useState({
    roomCode: '',
    creatorName: '',
    partnerName: '',
    photo: '',
    backgroundMusic: 'romantic_theme',
    theme: 'classic',
    loveMessage: '',
    cardEnabled: true,
    cardStyle: 'classic'
  });

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({ q: '', a: '' });
  const [savedQuiz, setSavedQuiz] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ title: '', message: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

  const decoyLibrary = {
    color: ["Red", "Blue", "Yellow", "Purple", "Green", "Black", "White", "Gold", "Silver"],
    food: ["Pizza", "Sushi", "Kottu", "Burger", "Pasta", "Rice & Curry", "Tacos", "Ramen"],
    place: ["Galle", "Kandy", "Colombo", "Ella", "Nuwara Eliya", "Paris", "Rome", "Tokyo"],
    hobby: ["Reading", "Gaming", "Cooking", "Dancing", "Painting", "Sports", "Music"],
    movie: ["Romance", "Comedy", "Action", "Sci-Fi", "Horror", "Drama", "Thriller"],
    default: ["The Moon", "2024", "Yes", "No", "Maybe", "Next Week", "Always", "Never"]
  };

  const handleFile = (e) => {
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, photo: reader.result });
    reader.readAsDataURL(e.target.files[0]);
  };

  const addQuestion = () => {
    if (!currentQ.q || !currentQ.a) {
      alert('Please fill in both question and answer!');
      return;
    }

    const qLower = currentQ.q.toLowerCase();
    let category = 'default';
    
    if (qLower.includes('color')) category = 'color';
    else if (qLower.includes('food') || qLower.includes('eat')) category = 'food';
    else if (qLower.includes('place') || qLower.includes('where')) category = 'place';
    else if (qLower.includes('hobby') || qLower.includes('do')) category = 'hobby';
    else if (qLower.includes('movie') || qLower.includes('film')) category = 'movie';

    const filteredDecoys = decoyLibrary[category].filter(
      d => d.toLowerCase() !== currentQ.a.toLowerCase()
    );
    const selectedDecoys = filteredDecoys.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [currentQ.a, ...selectedDecoys].sort(() => Math.random() - 0.5);

    const newQuestion = {
      questionText: currentQ.q,
      correctAnswer: currentQ.a,
      allOptions: options
    };

    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQ({ q: '', a: '' });
  };

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    if (!formData.roomCode || !formData.creatorName) {
      setErrorInfo({
        title: 'Missing Information! 📝',
        message: 'Please enter both room code and your name to create the quiz.'
      });
      setShowErrorModal(true);
      return;
    }
  
    if (questions.length === 0) {
      setErrorInfo({
        title: 'No Questions Added! ❓',
        message: 'Please add at least one question before saving your quiz.'
      });
      setShowErrorModal(true);
      return;
    }
  
    const quizData = {
      roomCode: formData.roomCode,
      creatorName: formData.creatorName,
      partnerName: formData.partnerName || '',
      photoUrl: formData.photo || '',
      backgroundMusic: formData.backgroundMusic,
      theme: formData.theme,
      loveMessage: formData.loveMessage || '',
      valentineCard: {
        enabled: formData.cardEnabled,
        style: formData.cardStyle,
        customMessage: formData.loveMessage || ''
      },
      questions: questions
    };
  
    try {
      const res = await fetch(`${API_URL}/api/quiz/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(quizData)
      });
  
      const data = await res.json();
      console.log('📨 Server response:', data);
      
      if (data.success) {
        setSavedQuiz(formData);
        setStep(4);
      } else {
        // Show beautiful error modal with redirect
        setErrorInfo({
          title: 'Room Code Taken! 💔',
          message: data.message || `The room code "${formData.roomCode}" is already being used by another lovely couple. Please choose a different code to create your unique love quiz!`
        });
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('❌ Save failed:', err);
      setErrorInfo({
        title: 'Connection Error! 🔌',
        message: 'Could not connect to the server. Please make sure the backend is running on port 5005!'
      });
      setShowErrorModal(true);
    }
  };

  // Step 1: Basic Details
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 relative overflow-hidden">
        <FloatingHearts />
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Back</span>
        </button>

        <div className="max-w-2xl mx-auto pt-20 relative z-10">
          <div className="text-center mb-10">
            <Heart size={48} className="text-pink-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Your Love Quiz
            </h1>
            <p className="text-gray-600">Step 1: Basic Details</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
            {/* Room Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Room Code (Secret Code) *
              </label>
              <input
                type="text"
                placeholder="e.g., JATHIS2026"
                value={formData.roomCode}
                onChange={e => setFormData({ ...formData, roomCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Creator Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.creatorName}
                onChange={e => setFormData({ ...formData, creatorName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Partner Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Partner's Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Their name"
                value={formData.partnerName}
                onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Couple Photo (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all"
                >
                  <Image size={20} className="text-pink-500" />
                  <span className="text-gray-600">
                    {formData.photo ? 'Photo Selected ✓' : 'Upload Photo'}
                  </span>
                </label>
              </div>
              {formData.photo && (
                <img src={formData.photo} alt="Preview" className="mt-4 w-32 h-32 rounded-xl object-cover mx-auto shadow-lg" />
              )}
            </div>

            {/* Music Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Background Music
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['romantic_theme', 'quiz_background', 'success_sound'].map(music => (
                  <button
                    key={music}
                    onClick={() => setFormData({ ...formData, backgroundMusic: music })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.backgroundMusic === music
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <Music size={20} className={formData.backgroundMusic === music ? 'text-pink-500 mx-auto' : 'text-gray-400 mx-auto'} />
                    <span className="text-xs block mt-1 capitalize">{music.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Quiz Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['classic', 'modern', 'vintage', 'playful', 'elegant'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => setFormData({ ...formData, theme, cardStyle: theme })}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      formData.theme === theme
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Next: Add Questions
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Add Questions
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 relative overflow-hidden">
        <FloatingHearts />
        
        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Add Quiz Questions
            </h1>
            <p className="text-gray-600">Step 2: Create personalized questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Question Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="text-pink-500" />
                New Question
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    placeholder="What's my favorite color?"
                    value={currentQ.q}
                    onChange={e => setCurrentQ({ ...currentQ, q: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Blue"
                    value={currentQ.a}
                    onChange={e => setCurrentQ({ ...currentQ, a: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={addQuestion}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Question
                </button>
              </div>

              <div className="mt-4 p-4 bg-pink-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Questions are automatically categorized and 3 decoy answers are added!
                </p>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Questions ({questions.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No questions added yet
                  </p>
                ) : (
                  questions.map((q, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {index + 1}. {q.questionText}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {q.correctAnswer}
                          </p>
                        </div>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={questions.length === 0}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next: Valentine Card
              <Wand2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Valentine Card
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 relative overflow-hidden">
        <FloatingHearts />
        
        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Valentine Card
            </h1>
            <p className="text-gray-600">Step 3: Add a special message</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Love Message
              </label>
              <textarea
                placeholder="Write a heartfelt message for your valentine..."
                value={formData.loveMessage}
                onChange={e => setFormData({ ...formData, loveMessage: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors resize-none"
                rows="5"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
              <input
                type="checkbox"
                id="cardEnabled"
                checked={formData.cardEnabled}
                onChange={e => setFormData({ ...formData, cardEnabled: e.target.checked })}
                className="w-5 h-5 text-pink-600 rounded"
              />
              <label htmlFor="cardEnabled" className="text-sm font-medium text-gray-700">
                Show Valentine Card at the end of quiz
              </label>
            </div>
          </div>

          {formData.cardEnabled && (
            <ValentineCard
              couplePhoto={formData.photo}
              creatorName={formData.creatorName}
              partnerName={formData.partnerName}
              customMessage={formData.loveMessage}
              style={formData.cardStyle}
            />
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Back
            </button>
            <button
              onClick={saveQuiz}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save & Share Quiz
            </button>
            {/* Error Modal */}
            {/* Error Modal */}
            <ErrorModal
              isOpen={showErrorModal}
              onClose={() => setShowErrorModal(false)}
              title={errorInfo.title}
              message={errorInfo.message}
              type="error"
              onAction={() => {
                // Redirect to Step 1 when modal closes
                if (errorInfo.title.includes('Room Code Taken')) {
                  setStep(1);
                  // Clear the room code so user can enter a new one
                  setFormData({ ...formData, roomCode: '' });
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Share
  if (step === 4 && savedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 flex items-center justify-center relative overflow-hidden">
        <FloatingHearts />
        
        <div className="relative z-10 w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full mb-6">
              <Heart size={40} className="text-white animate-pulse" fill="currentColor" />
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Quiz Created! 🎉
            </h1>
            <p className="text-xl text-gray-600">Share it with your special someone</p>
          </div>

          <QRCodeShare 
            roomCode={savedQuiz.roomCode}
            creatorName={savedQuiz.creatorName}
          />

          <div className="mt-8 text-center">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-white text-gray-700 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Create Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}