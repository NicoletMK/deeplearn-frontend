import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage.jsx';
import IntroCreditsPage from './pages/IntroCreditsPage.jsx';
import MainMenu from './pages/MainMenu.jsx';

export default function App() {
  const [view, setView] = useState('welcome');

  const goWelcome = () => setView('welcome');
  const goIntro   = () => setView('intro');
  const goMain    = () => setView('main');

  return (
    <div className="min-h-screen bg-yellow-100 font-sans">
      {view === 'welcome' && <WelcomePage onStart={goIntro} onExit={goWelcome} />}
      {view === 'intro'   && <IntroCreditsPage onContinue={goMain} onBack={goWelcome} />}
      {view === 'main'    && <MainMenu onExit={goWelcome} />}
    </div>
  );
}
