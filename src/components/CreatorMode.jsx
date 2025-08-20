import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const humanOptions = [
  { label: 'Human 1', image: '/characters/Human1.png', video: '/videos/creator/Human1.mp4' },
  { label: 'Human 2', image: '/characters/Human2.png', video: '/videos/creator/Human2.mp4' },
  { label: 'Human 3', image: '/characters/Human3.png', video: '/videos/creator/Human3.mp4' },
  { label: 'Human 4', image: '/characters/Human4.png', video: '/videos/creator/Human4.mp4' },
];

const nonhumanOptions = [
  { label: 'Statue 1', image: '/characters/Nonhuman1.png', video: '/videos/creator/Nonhuman1.mp4' },
  { label: 'Statue 2', image: '/characters/Nonhuman2.png', video: '/videos/creator/Nonhuman2.mp4' },
  { label: 'Cartoon 1', image: '/characters/Nonhuman3.png', video: '/videos/creator/Nonhuman3.mp4' },
  { label: 'Cartoon 2', image: '/characters/Nonhuman4.png', video: '/videos/creator/Nonhuman4.mp4' },
];

// Prompts
const humanPrompts = [
  "I love learning about AI!",
  "Let's make a DeepFake adventure!",
  "Technology is amazing!",
  "Watch me transform!",
  "Let's bring some magic to life!"
];

const fantasyPrompts = [
  "I'm coming to life from the fantasy world!",
  "Let's make some magic happen!",
  "Time to show my true colors!",
  "Can you believe this is real?",
  "Prepare for a fun surprise!"
];

export default function CreatorMode() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [overlayMode, setOverlayMode] = useState(false);

  // Handle face selection
  const handleSelect = (face) => {
    setLoading(true);
    setSelected(null);
    setTimeout(() => {
      setSelected(face);
      setLoading(false);
      setShowConfetti(true);
      // Set default prompt based on type
      setCurrentPrompt(humanOptions.includes(face) ? randomPrompt(humanPrompts) : randomPrompt(fantasyPrompts));
      setTimeout(() => setShowConfetti(false), 1500);
    }, 5000);
  };

  // Random prompt helper
  const randomPrompt = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Randomize current prompt
  const handleRandomPrompt = () => {
    if (!selected) return;
    const prompts = humanOptions.includes(selected) ? humanPrompts : fantasyPrompts;
    setCurrentPrompt(randomPrompt(prompts));
  };

  return (
    <div className="relative min-h-screen bg-yellow-100 p-6 font-sans">
      {showConfetti && <Confetti />}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-90 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-xl text-lg font-semibold border-4 border-yellow-300"
          >
            ⏳ Creating DeepFake Video... Please be patient 🤎
          </motion.div>
        </motion.div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6">🎭 Create Your DeepFake Video!</h1>

      {showPrompt && (
        <div className="fixed bottom-6 right-6 bg-white border-4 border-orange-400 shadow-lg p-4 rounded-xl z-50 max-w-xs text-left">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-orange-600 mb-1">🎬 How to Use</h2>
              <p className="text-sm text-gray-800">
                Tap a human face or a fantasy face to apply it to the video. Try playing the original and your DeepFake video at the same time!
              </p>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-500 hover:text-red-500 ml-3 font-bold text-lg"
              aria-label="Close how to use popup"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Human options */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-center mb-4">👦 Human Faces</h2>
          <div className="flex flex-col gap-3">
            {humanOptions.map((face, idx) => (
              <button
                key={idx}
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${selected?.label === face.label ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-3/4 mx-auto rounded-xl shadow-md hover:scale-105 hover:rotate-1 transition-transform"
                />
                <div className="text-sm mt-1 font-medium text-center">{face.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center videos & prompts */}
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold mb-2">🎥 Original Base Video</h2>
          <video src="/videos/creator/Vid.mp4" controls className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-6" />
          
          {selected && (
            <>
              <h2 className="text-xl font-semibold mb-2">✨ Your DeepFake Video</h2>

              <div className="mb-4">
                <button
                  onClick={() => setOverlayMode(!overlayMode)}
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg mb-2 hover:bg-blue-500 transition"
                >
                  {overlayMode ? 'Switch to Side-by-Side' : 'Switch to Overlay'}
                </button>
              </div>

              <div className="relative w-full max-w-md mx-auto">
                {overlayMode ? (
                  <>
                    <video src="/videos/creator/Vid.mp4" autoPlay loop muted className="absolute inset-0 w-full rounded-lg opacity-50" />
                    <video src={selected.video} autoPlay loop muted className="relative w-full rounded-lg" />
                  </>
                ) : (
                  <div className="flex gap-2">
                    <video src="/videos/creator/Vid.mp4" controls className="w-1/2 rounded-lg" />
                    <video src={selected.video} controls className="w-1/2 rounded-lg" />
                  </div>
                )}
              </div>

              {/* Prompt input & randomizer */}
              <div className="mt-4 flex flex-col gap-2 items-center">
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  className="w-full max-w-md border rounded-lg p-2 text-center"
                  placeholder="Enter your voice prompt..."
                />
                <button
                  onClick={handleRandomPrompt}
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition"
                >
                  🎲 Randomize Prompt
                </button>
              </div>
            </>
          )}
        </div>

        {/* Nonhuman options */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-center mb-4">🧸 Fantasy Faces</h2>
          <div className="flex flex-col gap-3">
            {nonhumanOptions.map((face, idx) => (
              <button
                key={idx}
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${selected?.label === face.label ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-3/4 mx-auto rounded-xl shadow-md hover:scale-105 hover:rotate-1 transition-transform"
                />
                <div className="text-sm mt-1 font-medium text-center">{face.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
