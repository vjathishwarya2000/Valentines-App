import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Creator from './pages/Creator';
import Player from './pages/Player';
import ResultsPage from './pages/ResultsPage';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [mode, setMode] = useState('landing');
  const [quizResults, setQuizResults] = useState(null);

  const handleNavigation = (newMode) => {
    setMode(newMode);
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setMode('results');
  };

  return (
    <>
      {mode === 'landing' && <LandingPage onNavigate={handleNavigation} />}
      {mode === 'create' && <Creator onBack={() => handleNavigation('landing')} />}
      {mode === 'play' && (
        <Player 
          onBack={() => handleNavigation('landing')}
          onComplete={handleQuizComplete}
        />
      )}
      {mode === 'results' && quizResults && (
        <ResultsPage 
          results={quizResults}
          onHome={() => handleNavigation('landing')}
        />
      )}
      <MusicPlayer track="romantic_theme" autoPlay={false} />
    </>
  );
}

export default App;