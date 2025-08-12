import React, { useState, useEffect, useCallback } from 'react';
import CreatorMode from '../components/CreatorMode';
import DetectiveMode from '../components/DetectiveMode';
import EthicsReflection from '../components/EthicsReflection';
import HeyGenDemo from '../components/CreatorHeyGen';
import { detectivePreSets, detectivePostSets } from "../data/detectiveVideoSets";

export default function MainMenu({ onExit, onShowIntro }) {
  const [view, setView] = useState('detectiveTraining');
  const [showMenu, setShowMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const toggleMenu = () => setShowMenu(s => !s);
  const openAbout = () => { setShowMenu(false); setShowAbout(true); };
  const closeAbout = useCallback(() => setShowAbout(false), []);
  useEffect(() => {
    function onKey(e){ if(e.key==='Escape') closeAbout(); }
    if (showAbout) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showAbout, closeAbout]);

  const views = [
    { key:'detectiveTraining', label:'Detective Warm-Up',  icon:'/DetectiveIcon.png',  subtitle:'Spot the tell-tale signs' },
    { key:'deepfakeStudio',    label:'Deepfake Studio',    icon:'/CreativeIcon.png',   subtitle:'Hands-on face swaps (safe set)' },
    { key:'aiVideoLab',        label:'Avatar Lab',         icon:'/HeyGenIcon.png',     subtitle:'Build talking avatars (HeyGen)' },
    { key:'deepfakeForensics', label:'Detective Mastery',  icon:'/DetectiveIcon.png',  subtitle:'Tackle tough, timed cases' },
    { key:'ethicsHub',         label:'Ethics & Impact',    icon:'/EthicalIcon.png',    subtitle:'Reflect on fairness, harm & consent' },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-yellow-100">
      {/* Header */}
      <div className="relative w-full flex justify-between items-center bg-sky-300 p-4 rounded-t-xl">
        <h1 className="text-3xl font-bold text-blue-900">DeepLearn</h1>
        <div className="relative">
          <button onClick={toggleMenu} className="space-y-1 focus:outline-none" aria-haspopup="menu" aria-expanded={showMenu} aria-label="Open menu">
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
          </button>
          <div
            className={
              "absolute right-0 mt-2 w-56 bg-white border border-blue-300 rounded-lg shadow-lg z-20 transform transition-all duration-200 origin-top " +
              (showMenu ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")
            }
            role="menu"
          >
            <button
              onClick={openAbout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
              role="menuitem"
            >
              ❓ About This App
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                role="menuitem"
              >
                🚪 Exit
              </button>
            )}
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
              className={`flex flex-col items-center gap-1 w-full p-2 rounded-lg ${view === key ? 'bg-blue-500 text-yellow-200' : 'hover:bg-blue-400'}`}
              aria-current={view === key ? 'page' : undefined}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <img src={icon} alt="" className="w-10 h-10" />
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
          {view === 'ethicsHub' && <EthicsReflection onExit={onExit} />}
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-30 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="about-title">
          <button className="absolute inset-0 bg-black/40" onClick={closeAbout} aria-label="Close" />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mx-4">
            <h2 id="about-title" className="text-2xl font-extrabold text-blue-900 mb-2">About DeepLearn</h2>
            <ul className="text-gray-800 space-y-1 mb-4">
              <li>• Watch fun videos and guess if they’re real or fake.</li>
              <li>• Explore how AI videos are made to understand creator tricks.</li>
              <li>• Reflect on the impact of AI on what we see online.</li>
            </ul>
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 mb-4">
              <h3 className="text-lg font-bold text-orange-700">Dataset Credits (Quick)</h3>
              <p className="text-gray-800 mt-1">
                Using a curated, kid-safe subset of <span className="font-semibold">Deepfake-Eval-2024</span> (Chandra et al., 2025).
              </p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• ~45h video, 56.5h audio, 1,975 images • 88 sites • 52 languages</li>
                <li>• License: CC BY-SA 4.0 • Direct use only (no generative training)</li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-3">
                <a className="text-sm font-semibold text-orange-700 underline" href="https://arxiv.org/abs/2503.02857" target="_blank" rel="noreferrer">Paper (arXiv)</a>
                <a className="text-sm font-semibold text-orange-700 underline" href="https://doi.org/10.48550/arXiv.2503.02857" target="_blank" rel="noreferrer">DOI</a>
                <a className="text-sm font-semibold text-orange-700 underline" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={closeAbout} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
