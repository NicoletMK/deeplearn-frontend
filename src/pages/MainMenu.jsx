import React, { useState } from 'react';
import CreatorMode from '../components/CreatorMode';
import DetectiveMode from '../components/DetectiveMode';
import EthicsReflection from '../components/EthicsReflection';
import { detectivePrePairs, detectivePostPairs } from '../data/detectivePairs';

export default function MainMenu({ onExit }) {
  const [view, setView] = useState('detectivePre');
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const views = [
    { key: 'detectivePre', label: 'Detective Pre', icon: '/DetectiveIcon.png' },
    { key: 'creator', label: 'Creator', icon: '/CreativeIcon.png' },
    { key: 'detectivePost', label: 'Detective Post', icon: '/DetectiveIcon.png' },
    { key: 'ethics', label: 'Ethics', icon: '/EthicalIcon.png' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-yellow-100">
      {/* Header */}
      <div className="relative w-full flex justify-between items-center bg-sky-300 p-4 rounded-t-xl">
        <h1 className="text-3xl font-bold text-blue-900">DeepLearn</h1>
        <div className="relative">
          <button onClick={toggleMenu} className="space-y-1 focus:outline-none">
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
          </button>
          <div
            className={
              "absolute right-0 mt-2 w-40 bg-white border border-blue-300 rounded-lg shadow-lg z-10 transform transition-all duration-200 origin-top " +
              (showMenu ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")
            }
          >
            <button
              onClick={() => {
                onExit();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              🔙 Exit to Home
            </button>
            <button
              onClick={() => {
                alert('This is the DeepLearn main menu — choose a mode to begin your AI journey!');
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              ❓ About
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-48 bg-sky-300 p-4 flex flex-col items-center gap-6 text-white font-semibold">
          {views.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex flex-col items-center gap-2 ${
                view === key ? 'text-yellow-200' : 'hover:text-yellow-200'
              }`}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <img src={icon} alt={label} className="w-12 h-12" />
              </div>
              <span className="text-sm mt-1">{label}</span>
            </button>
          ))}
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {view === 'detectivePre' && (
            <DetectiveMode
              videoPairs={detectivePrePairs}
              session="pre"
              onComplete={() => setView('creator')}
            />
          )}
          {view === 'creator' && (
            <CreatorMode onComplete={() => setView('detectivePost')} />
          )}
          {view === 'detectivePost' && (
            <DetectiveMode
              videoPairs={detectivePostPairs}
              session="post"
              onComplete={() => setView('ethics')}
            />
          )}
          {view === 'ethics' && <EthicsReflection onExit={onExit} />}
        </div>
      </div>
    </div>
  );
}
