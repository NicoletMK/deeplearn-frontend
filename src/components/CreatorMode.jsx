import React, { useState } from 'react';
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

export default function CreatorMode() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleSelect = (face) => {
    setLoading(true);
    setSelected(null);
    setTimeout(() => {
      setSelected(face);
      setLoading(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }, 3000);
  };

  const playBothVideos = () => {
    const original = document.getElementById('originalVideo');
    const swapped = document.getElementById('swappedVideo');
    if (original && swapped) {
      original.currentTime = 0;
      swapped.currentTime = 0;
      original.play();
      swapped.play();
    }
  };

  return (
    <div className="relative min-h-screen bg-yellow-100 p-6 font-sans">
      {showConfetti && <Confetti />}

      {/* Loading overlay */}
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
            className="bg-white p-6 rounded-xl shadow-xl text-lg font-semibold border-4 border-yellow-300 text-center"
          >
            ⏳ Creating your fun face swap video… 🎭
          </motion.div>
        </motion.div>
      )}

      {/* Page title */}
      <h1 className="text-3xl font-bold text-center mb-6">🎭 Create Your DeepFake Video!</h1>

      {/* Floating kid-friendly guide */}
      <div className="fixed top-6 left-6 bg-white p-3 rounded-xl border-2 border-yellow-400 shadow-lg max-w-xs text-sm z-50">
        🐣 Step 1: Pick a face! <br />
        🐣 Step 2: Watch it appear in the video! <br />
        🐣 Step 3: Press play and compare the videos! 🎉
      </div>

      {/* How-to popup */}
      {showPrompt && (
        <div className="fixed bottom-6 right-6 bg-white border-4 border-orange-400 shadow-lg p-4 rounded-xl z-50 max-w-xs text-left">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-orange-600 mb-1">🎬 How to Use</h2>
              <p className="text-sm text-gray-800">
                Tap a human face or a fantasy face to apply it to the video. Try playing the original and your new video together to see the changes!
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

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Human options */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-center mb-4">👦 Human Faces</h2>
          <div className="flex flex-col gap-3">
            {humanOptions.map((face, idx) => (
              <button
                key={idx}
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${
                  selected?.label === face.label ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 hover:rotate-1`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-3/4 mx-auto rounded-xl shadow-md hover:scale-110 hover:rotate-1 transition-transform"
                />
                <div className="text-sm mt-1 font-medium text-center">🎯 {face.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center videos */}
        <div className="flex-1 text-center relative">
          <h2 className="text-xl font-semibold mb-2">🎥 Original Base Video</h2>
          <video
            id="originalVideo"
            src="/videos/creator/Vid.mp4"
            controls
            className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-6"
          />

          {selected && (
            <>
              <h2 className="text-xl font-semibold mb-2">✨ Your Face Swap Video</h2>
              <video
                id="swappedVideo"
                src={selected.video}
                controls
                className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-2"
              />

              {/* Kid-friendly comparison prompt */}
              <div className="mt-2 bg-white rounded-xl border-2 border-yellow-400 p-3 shadow-md max-w-md mx-auto animate-pulse">
                👀 Press "▶ Play Both Videos" and see if you can spot the differences! 🔍✨
              </div>

              <button
                onClick={playBothVideos}
                className="bg-green-400 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-500 transition"
              >
                ▶ Play Both Videos!
              </button>
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
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${
                  selected?.label === face.label ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 hover:rotate-1`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-3/4 mx-auto rounded-xl shadow-md hover:scale-110 hover:rotate-1 transition-transform"
                />
                <div className="text-sm mt-1 font-medium text-center">✨ {face.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
