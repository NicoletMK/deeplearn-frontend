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

  const generateVideo = () => {
    if (selectedCharacter && selectedPhraseIndex !== null) {
      // Get the pre-made video based on selected character and phrase
      const videoPath = videoMap[selectedCharacter.voice][selectedPhraseIndex];
      setGeneratedVideo(videoPath);
      setShowModal(true);
    }
  };

  const reset = () => {
    setSelectedCharacter(null);
    setSelectedPhraseIndex(null);
    setGeneratedVideo(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-6">Deepfake Creator</h1>

      <p className="max-w-xl text-center text-blue-900 font-medium mb-6">
        Select a character and a phrase. You'll see how AI creates a talking video by combining just an image and a sound — this is called a <strong>deepfake</strong>!
      </p>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex flex-col items-center gap-6">
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
                <img src={char.image} alt={char.name} className="w-36 h-36 rounded-full object-cover" />
                <div className="text-sm mt-2 text-blue-900 font-medium text-center">{char.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl font-semibold text-blue-900">Choose a phrase</h2>
          <div className="flex flex-col gap-3">
            {phrases.map((text, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhraseIndex(index)}
                className={`px-5 py-3 text-sm rounded-full border w-60 text-center transition ${
                  selectedPhraseIndex === index ? 'border-orange-500 bg-orange-100' : 'border-blue-300'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generateVideo}
        disabled={!selectedCharacter || selectedPhraseIndex === null}
        className="mt-8 bg-orange-500 text-white font-bold py-3 px-10 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
      >
        Show Deepfake Video
      </button>

      {/** Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🎬 Here's your deepfake video!</h3>

            {generatedVideo && (
              <video controls autoPlay className="w-full rounded-lg shadow-md mb-4">
                <source src={generatedVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                if (onComplete) onComplete();
              }}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition"
            >
              Next: Detective Mode
            </button>

            <p className="mt-6 text-sm text-blue-800">
              <strong>Note for Kids:</strong> This is how a deepfake is created — just a face image and a voice clip.
              Imagine how powerful (or dangerous) this can be if used to impersonate someone in real life!
            </p>

            <button
              onClick={reset}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Generate another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}