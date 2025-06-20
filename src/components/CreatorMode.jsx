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
      setTimeout(() => setShowConfetti(false), 1000);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen bg-yellow-100 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">🎭 Create Your DeepFake Video!</h1>

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

      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Human options */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">👦 Human Faces</h2>
          <div className="grid grid-cols-2 gap-2">
            {humanOptions.map((face, idx) => (
              <button
                key={idx}
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${selected?.label === face.label ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-full rounded-xl shadow-md hover:scale-105"
                />
                <div className="text-sm mt-1 font-medium text-center">{face.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center videos */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">🎥 Original Base Video</h2>
          <video src="/videos/creator/Vid.mp4" controls className="mx-auto rounded-lg shadow-xl w-full max-w-md mb-6" />
          {selected && (
            <>
              <h2 className="text-xl font-semibold mb-2">✨ Your DeepFake Video</h2>
              <video src={selected.video} controls className="mx-auto rounded-lg shadow-xl w-full max-w-md" />
            </>
          )}
        </div>

        {/* Nonhuman options */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">🧸 Fantacy Faces</h2>
          <div className="grid grid-cols-2 gap-2">
            {nonhumanOptions.map((face, idx) => (
              <button
                key={idx}
                className={`border-4 rounded-xl p-1 transition-all duration-300 ${selected?.label === face.label ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => handleSelect(face)}
              >
                <img
                  src={face.image}
                  alt={face.label}
                  className="w-full rounded-xl shadow-md hover:scale-105"
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
