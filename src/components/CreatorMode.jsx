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
            🎭Creating your deepfake video…⏳ 
          </motion.div>
        </motion.div>
      )}

      {/* Page title */}
      <h1 className="text-3xl font-bold text-center mb-2">
        🎬Create Your DeepFake Video by Face Swapping🎭
      </h1>


<div className="mx-auto max-w-md bg-yellow-100 border-2 border-yellow-200 rounded-xl p-6 mb-6 text-left text-lg shadow-md">
  🎭 Step 1: Pick a face from the Human or Fantasy options. <br />
  ⏳ Step 2: Wait until the face-swapped video appears. <br />
  🔍 Step 3: Press "▶ Play Both Videos" and compare them!
</div>


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
          <h2 className="text-xl font-semibold mb-2">🎥 Real Base Video</h2>
          <video
            id="originalVideo"
            src="/videos/creator/Vid.mp4"
            controls
            className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-6"
          />

          {selected && (
            <>
              <h2 className="text-xl font-semibold mb-2">✨ Face Swap Video</h2>
              <video
                id="swappedVideo"
                src={selected.video}
                controls
                className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-2"
              />

              <button
                onClick={playBothVideos}
                className="bg-green-400 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-500 transition"
              >
                ▶ Play Both Videos!
              </button>
  
              <div className="mt-2 bg-white rounded-xl border-2 border-yellow-400 p-3 shadow-md max-w-md mx-auto animate-pulse">
                ▶ Play Both Videos and Compare REAL VS AI🔍
              </div>
            </>
          )}
        </div>

        {/* Nonhuman options */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-center mb-4">🗿Fantasy Faces</h2>
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
