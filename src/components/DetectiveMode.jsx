import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

export default function DetectiveMode({ videoPairs, session = 'pre', onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [guessIndex, setGuessIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("deeplearnUserId");
    if (stored) {
      setUserId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }
  }, []);

  const trimmedPairs = videoPairs.slice(0, 3); // Enforce exactly 3 pairs

  if (!trimmedPairs || trimmedPairs.length === 0) {
    return <div className="text-center py-10 text-red-600">⚠️ No videos available</div>;
  }

  const currentPair = trimmedPairs[currentIndex];

  const handleGuess = async (index) => {
    if (showFeedback) return;

    const selected = currentPair.videos[index];
    const correct = selected.label === "fake";
    setGuessIndex(index);
    setIsCorrect(correct);
    setShowFeedback(true);

    const payload = {
      userId,
      session,
      timestamp: new Date().toISOString(),
      pairIndex: currentIndex,
      selectedIndex: index,
      actualLabel: selected.label,
      correct,
      videos: currentPair.videos.map(v => v.url)
    };

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
      await fetch(`${backend}/api/detective`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("❌ Submission failed:", err);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < trimmedPairs.length) {
      setCurrentIndex(currentIndex + 1);
      setGuessIndex(null);
      setIsCorrect(null);
      setShowFeedback(false);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-0">
      <div className="bg-yellow-50 border-4 border-orange-400 rounded-2xl shadow-xl w-full max-w-6xl p-10 text-center mt-0">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">
          Detective Mode {session === 'pre' ? '(Before Creation)' : '(After Creation)'}
        </h1>
        <p className="text-xl text-gray-800 mb-8">
          Which one is fake? Click a button to choose.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8"
          >
            {currentPair.videos.map((video, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <video controls className="w-full rounded shadow-xl max-w-xl">
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={() => handleGuess(idx)}
                  disabled={showFeedback}
                  className={`mt-4 px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 text-lg
                    ${showFeedback ?
                      (idx === guessIndex && isCorrect ? 'bg-green-600' : idx === guessIndex ? 'bg-red-600' : 'bg-gray-400')
                      : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  Select as Fake
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {showFeedback && (
          <div className={`text-2xl font-semibold mb-6 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '✅ Correct! You spotted the fake.' : '❌ Not quite! That was the real one.'}
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full"
          >
            {currentIndex === trimmedPairs.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
}
