import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage.jsx';
import MainMenu from './pages/MainMenu.jsx';
import IntroCreditsPage from './pages/IntroCreditsPage.jsx'; // <- new page

export default function App() {
  const [view, setView] = useState('welcome');

  const handleStart = () => setView('intro');     // welcome -> intro
  const handleExit = () => {
    localStorage.removeItem('deeplearnUserId');
    setView('welcome');
  };

  return (
    <div className="min-h-screen bg-yellow-100 font-sans">
      {view === 'welcome' && (
        <WelcomePage onStart={handleStart} onExit={handleExit} />
      )}
      {view === 'intro' && (
        <IntroCreditsPage
          onBack={() => setView('welcome')}
          onContinue={() => setView('main')}
        />
      )}
      {view === 'main' && (
        <MainMenu
          onExit={handleExit}
          onShowIntro={() => setView('intro')} // allow opening credits from menu
        />
      )}
    </div>
  );
}
