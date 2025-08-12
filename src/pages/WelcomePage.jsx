import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function WelcomePage({ onStart, onExit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const toggleMenu = () => setShowMenu((v) => !v);
  const openAbout = () => { setShowMenu(false); setShowAbout(true); };
  const closeAbout = useCallback(() => setShowAbout(false), []);

  // Memoize so we can safely reference in effects
  const sendToBackend = useCallback(async (data, isRetry = false) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backend}/api/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      console.log(isRetry ? '✅ Retried submission success' : '✅ Submitted to backend');

      if (isRetry) {
        localStorage.removeItem('deeplearnUnsent');
      }
    } catch (error) {
      console.error('❌ Submission failed:', error);
      if (!isRetry) {
        localStorage.setItem('deeplearnUnsent', JSON.stringify(data));
      }
    }
  }, []);

  // On mount: ensure userId and retry unsent payloads
  useEffect(() => {
    const stored = localStorage.getItem('deeplearnUserId');
    if (stored) {
      setUserId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem('deeplearnUserId', newId);
      setUserId(newId);
    }

    const unsent = localStorage.getItem('deeplearnUnsent');
    if (unsent && navigator.onLine) {
      try {
        const data = JSON.parse(unsent);
        sendToBackend(data, true);
      } catch {
        // If parse fails, clear the bad cache
        localStorage.removeItem('deeplearnUnsent');
      }
    }
  }, [sendToBackend]);

  // Modal: close on Escape + lock body scroll
  useEffect(() => {
    if (!showAbout) return;

    function onKey(e) {
      if (e.key === 'Escape') closeAbout();
    }
    document.addEventListener('keydown', onKey);

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = prevOverflow;
    };
  }, [showAbout, closeAbout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      userId,
      firstName,
      lastName,
      age,
      grade,
      timestamp: new Date().toISOString(),
    };

    onStart();            // navigate immediately
    sendToBackend(payload); // fire-and-forget
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-6">
      <div className="relative w-full flex justify-between items-center bg-sky-300 p-4 rounded-t-xl">
        <h1 className="text-3xl font-bold text-blue-900">DeepLearn</h1>
        <div className="relative">
          <button onClick={toggleMenu} className="space-y-1 focus:outline-none" aria-haspopup="menu" aria-expanded={showMenu}>
            <div className="w-6 h-1 bg-blue-800 rounded" />
            <div className="w-6 h-1 bg-blue-800 rounded" />
            <div className="w-6 h-1 bg-blue-800 rounded" />
          </button>
          <div
            className={
              "absolute right-0 mt-2 w-40 bg-white border border-blue-300 rounded-lg shadow-lg z-10 transform transition-all duration-200 origin-top " +
              (showMenu ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")
            }
            role="menu"
          >
            <button
              onClick={openAbout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
              role="menuitem"
              type="button"
            >
              ❓ About This App
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8 text-center">
        <h2 className="text-5xl font-extrabold text-orange-600 mb-4">Welcome to DeepLearn!</h2>
        <p className="text-xl text-blue-900 font-semibold mb-3">
          You’re about to become a <span className="text-purple-700">deepfake detective</span>! 🕵️‍♀️
        </p>
        <div className="text-lg text-gray-800 space-y-2 font-medium">
          <p>🌟 <span className="text-pink-600">Watch fun videos</span> and guess if they’re real or fake.</p>
          <p>🎨 <span className="text-blue-600">Create your own AI videos</span> to learn how deepfakes are made.</p>
          <p>💬 <span className="text-green-600">Think about the impact</span> of AI on what we see online.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 bg-yellow-50 p-6 rounded-lg shadow-md w-full max-w-4xl mt-6">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src="/Welcome.png" alt="Welcome illustration" className="w-full max-w-md h-auto" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-500 text-white font-bold py-3 rounded-md transition text-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
            >
              {loading ? "Starting..." : "🚀 Get Started"}
            </button>
          </form>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-30 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="about-title">
          <button className="absolute inset-0 bg-black/40" onClick={closeAbout} aria-label="Close" type="button" />
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
              <button onClick={closeAbout} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50" type="button">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
