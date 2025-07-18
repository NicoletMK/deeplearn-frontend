import React, { useState } from 'react';
import CreatorMode from '../components/CreatorMode';
import DetectiveMode from '../components/DetectiveMode';
import EthicsReflection from '../components/EthicsReflection';
import HeyGenDemo from '../components/CreatorHeyGen'; // New component for HeyGen videos
import { detectivePreSets, detectivePostSets } from "../data/detectiveVideoSets";

export default function MainMenu({ onExit }) {
  const [view, setView] = useState('detectiveTraining');
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const views = [
    { 
      key: 'detectiveTraining', 
      label: 'Detective Training', 
      icon: '/DetectiveIcon.png',
      subtitle: 'Learn detection basics'
    },
    { 
      key: 'deepfakeStudio', 
      label: 'Deepfake Studio', 
      icon: '/CreativeIcon.png',
      subtitle: 'Try premade deepfakes'
    },
    { 
      key: 'aiVideoLab', 
      label: 'AI Video Lab', 
      icon: '/HeyGenIcon.png', // New icon
      subtitle: 'See HeyGen\'s avatar tech'
    },
    { 
      key: 'deepfakeForensics', 
      label: 'Deepfake Forensics', 
      icon: '/DetectiveIcon.png',
      subtitle: 'Test your skills'
    },
    { 
      key: 'ethicsHub', 
      label: 'Ethics Hub', 
      icon: '/EthicalIcon.png',
      subtitle: 'Reflect on implications'
    }
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
                setView('detectiveTraining');
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              🔁 Restart Flow
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
        <div className="w-48 bg-sky-300 p-4 flex flex-col items-center gap-4 text-white font-semibold">
          {views.map(({ key, label, icon, subtitle }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex flex-col items-center gap-1 w-full p-2 rounded-lg ${
                view === key ? 'bg-blue-500 text-yellow-200' : 'hover:bg-blue-400'
              }`}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <img src={icon} alt={label} className="w-10 h-10" />
              </div>
              <span className="text-sm font-bold">{label}</span>
              <span className="text-xs text-center opacity-80">{subtitle}</span>
            </button>
          ))}
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {view === 'detectiveTraining' && (
            <DetectiveMode
              videoPairs={detectivePreSets}
              session="pre"
              onComplete={() => setView('deepfakeStudio')}
            />
          )}
          {view === 'deepfakeStudio' && (
            <CreatorMode onComplete={() => setView('aiVideoLab')} />
          )}
          {view === 'aiVideoLab' && (
            <HeyGenDemo onComplete={() => setView('deepfakeForensics')} />
          )}
          {view === 'deepfakeForensics' && (
            <DetectiveMode
              videoPairs={detectivePostSets}
              session="post"
              onComplete={() => setView('ethicsHub')}
            />
          )}
          {view === 'ethicsHub' && (
            <EthicsReflection onExit={onExit} />
          )}
        </div>
      </div>
    </div>
  );
}