import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage.jsx';
import MainMenu from './pages/MainMenu.jsx';

export default function App() {
  const [view, setView] = useState('welcome');

  const handleStart = () => {
    setView('main');
  };

  const handleExit = () => {
    localStorage.removeItem('deeplearnUserId');  // Optional: reset user session
    setView('welcome');
  };

  return (
    <div className="min-h-screen bg-yellow-100 font-sans">
      {view === 'welcome' && (
        <WelcomePage onStart={handleStart} onExit={handleExit} />
      )}
      {view === 'main' && (
        <MainMenu onExit={handleExit} />
      )}
    </div>
  );
}
