import React, { useState } from 'react';

const characters = [
  { name: 'Raven', image: '/characters/Raven.png', voice: 'raven' },
  { name: 'Booker', image: '/characters/Booker.png', voice: 'booker' },
  { name: 'Nia', image: '/characters/Nia.png', voice: 'nia' },
];

const phrases = [
  'I love learning about AI!',
  "Let's make a deepfake!",
  'Technology is awesome!'
];

// Mapping of character and phrase index to pre-made videos
const videoMap = {
  raven: {
    0: '/videos/creator/Raven0.mp4',
    1: '/videos/creator/Raven1.mp4',
    2: '/videos/creator/Raven2.mp4'
  },
  booker: {
    0: '/videos/creator/Booker0.mp4',
    1: '/videos/creator/Booker1.mp4',
    2: '/videos/creator/Booker2.mp4'
  },
  nia: {
    0: '/videos/creator/Nia0.mp4',
    1: '/videos/creator/Nia1.mp4',
    2: '/videos/creator/Nia2.mp4'
  }
};

export default function CreatorMode({ onComplete }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Keep the timeout and the progress bar duration in sync
  const LOADING_MS = 3000;

  const generateVideo = () => {
    if (selectedCharacter && selectedPhraseIndex !== null) {
      setShowModal(true);
      setLoading(true);

      setTimeout(() => {
        const videoPath = videoMap[selectedCharacter.voice][selectedPhraseIndex];
        setGeneratedVideo(videoPath);
        setLoading(false);
      }, LOADING_MS);
    }
  };

  const reset = () => {
    setSelectedCharacter(null);
    setSelectedPhraseIndex(null);
    setGeneratedVideo(null);
    setShowModal(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center py-10 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center">
        🗣️ AI Avatar Maker 🎥
      </h1>

      {/* Friendly step-by-step instructions */}
      <div className="mx-auto max-w-md bg-yellow-180 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-left text-md shadow-md">
        Step 1: Pick a character.<br />
        Step 2: Pick a sentence.<br />
        Step 3: Click the button to create.<br />
        Step 4: Wait and watch the avatar 🧑🏻‍🤝‍🧑🏼
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Character selection */}
        <div className="flex flex-col items-center gap-6 min-h-[100px]">
          <h2 className="text-xl font-semibold text-blue-900">Choose a character</h2>
          <div className="flex gap-4">
            {characters.map((char) => (
              <button
                key={char.name}
                onClick={() => setSelectedCharacter(char)}
                className={`border-4 rounded-full p-1 transition ${
                  selectedCharacter?.name === char.name ? 'border-orange-500' : 'border-transparent'
                }`}
              >
                <img src={char.image} alt={char.name} className="w-56 h-56 rounded-full object-cover" />
                <div className="text-sm mt-2 text-blue-900 font-medium text-center">{char.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sentence selection */}
        <div className="flex flex-col items-center gap-6 min-h-[100px]">
          <h2 className="text-xl font-semibold text-blue-900">Choose a sentence</h2>
          <div className="flex flex-col gap-3">
            {phrases.map((text, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhraseIndex(index)}
                className={`px-5 py-3 text-md rounded-full border w-60 text-center transition ${
                  selectedPhraseIndex === index ? 'border-orange-500 bg-orange-100' : 'border-blue-300'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generateVideo}
        disabled={!selectedCharacter || selectedPhraseIndex === null}
        className="mt-8 bg-orange-500 text-white font-bold py-3 px-10 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
      >
        Make An Avatar
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto text-center">

            {/* Loading state with progress bar */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 w-full" aria-busy="true">
                <p className="text-blue-800 font-medium text-lg mb-4"> 🗣️Processing...🎥 </p>
                <div className="w-3/4 max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-orange-300 h-4 rounded-full animate-progressFill"
                    style={{ animationDuration: `${LOADING_MS}ms` }}
                  />
                </div>
              </div>
            )}

            {/* Video */}
            {!loading && generatedVideo && (
              <h3 className="text-2xl font-bold text-blue-900 mb-4">🎬 Here’s your AI avatar!</h3>
              <video
                controls
                autoPlay
                className="w-full max-h-[60vh] rounded-lg shadow-md mb-4 object-contain"
              >
                <source src={generatedVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Next button */}
            {!loading && (
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onComplete) onComplete();
                }}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition"
              >
                Next: Detective Mode
              </button>
            )}

            {/* Kids note */}
            {!loading && (
              <p className="mt-6 text-sm text-blue-800">
                <strong>Note:</strong> This shows how an AI avatar can be made from just a photo and a script.
                How do you think about it?💭
              </p>
            )}

            {/* Reset */}
            {!loading && (
              <button
                onClick={reset}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Make another
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
