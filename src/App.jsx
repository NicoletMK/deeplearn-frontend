import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage.jsx';
import MainMenu from './pages/MainMenu.jsx';

export default function App() {
  const [view, setView] = useState('welcome');

  const goWelcome = () => setView('welcome');
  const goMain    = () => setView('main');

  return (
    <div className="min-h-screen bg-yellow-100 font-sans">
      {view === 'welcome' && <WelcomePage onStart={goMain} onExit={goWelcome} />}
      {view === 'main'    && <MainMenu onExit={goWelcome} />}
    </div>
  );
}
