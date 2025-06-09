import React from 'react';
import MainMenu from './pages/MainMenu';

export default function App() {
  return (
    <div className="min-h-screen bg-yellow-100 font-sans">
      <MainMenu onExit={() => {}} />
    </div>
  );
}
