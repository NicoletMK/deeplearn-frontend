// src/data/creatorVideos.js
export const creatorVideos = [
  { id: "booker0", character: "Booker", index: 0, url: "/videos/creator/Booker0.mp4", audio: "/voices/booker-0.mp3" },
  { id: "booker1", character: "Booker", index: 1, url: "/videos/creator/Booker1.mp4", audio: "/voices/booker-1.mp3" },
  { id: "booker2", character: "Booker", index: 2, url: "/videos/creator/Booker2.mp4", audio: "/voices/booker-2.mp3" },
  { id: "raven0", character: "Raven", index: 0, url: "/videos/creator/Raven0.mp4", audio: "/voices/raven-0.mp3" },
  { id: "raven1", character: "Raven", index: 1, url: "/videos/creator/Raven1.mp4", audio: "/voices/raven-1.mp3" },
  { id: "raven2", character: "Raven", index: 2, url: "/videos/creator/Raven2.mp4", audio: "/voices/raven-2.mp3" },
  { id: "nia0", character: "Nia", index: 0, url: "/videos/creator/Nia0.mp4", audio: "/voices/nia-0.mp3" },
  { id: "nia1", character: "Nia", index: 1, url: "/videos/creator/Nia1.mp4", audio: "/voices/nia-1.mp3" },
  { id: "nia2", character: "Nia", index: 2, url: "/videos/creator/Nia2.mp4", audio: "/voices/nia-2.mp3" },
];



// src/pages/DetectiveMode.jsx
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../utils/firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DetectiveMode({ videoPairs, session = 'pre', onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [userId, setUserId] = useState("");
  const current = videoPairs[currentIndex];

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

  const handleGuess = async (type) => {
    setGuess(type);
    const correct = current.label === type;
    setFeedback(correct ? "✅ You got it right!" : "❌ Oops! That's incorrect.");

    const payload = {
      userId,
      videoFile: current.videoUrl,
      actualLabel: current.label,
      userGuess: type,
      correct,
      session,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, session === 'pre' ? "preSurvey" : "postSurvey"), payload);
    } catch (err) {
      console.error("Detective guess submission failed:", err);
    }
  };

  const nextVideo = () => {
    if (currentIndex + 1 < videoPairs.length) {
      setCurrentIndex(currentIndex + 1);
      setGuess(null);
      setFeedback("");
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-0 pt-4">
      <img src="/Detection.png" alt="Detective Icon" className="w-56 h-56 mb-4" />
      <h1 className="text-4xl font-bold text-orange-600 mb-2">
        Detective Mode {session === "pre" ? "(Before Creation)" : "(After Creation)"}
      </h1>
      <p className="text-lg text-blue-900 mb-4 text-center max-w-xl">
        Watch the video. Can you tell if it’s real or fake?
      </p>

      <video
        key={current.videoUrl}
        controls
        className="w-full max-w-md rounded-lg shadow-lg mb-4"
      >
        <source src={current.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="flex gap-6 mb-4">
        <button
          className={`px-6 py-2 rounded-full font-bold ${
            guess === "real" ? "bg-blue-700 text-white" : "bg-blue-300"
          }`}
          onClick={() => handleGuess("real")}
          disabled={!!guess}
        >
          Real
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold ${
            guess === "fake" ? "bg-red-700 text-white" : "bg-red-300"
          }`}
          onClick={() => handleGuess("fake")}
          disabled={!!guess}
        >
          Fake
        </button>
      </div>

      {feedback && (
        <div className="text-xl font-semibold text-blue-900 mb-4">{feedback}</div>
      )}
      {guess && (
        <button
          onClick={nextVideo}
          className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-full font-bold"
        >
          {currentIndex === videoPairs.length - 1 ? "Finish" : "Next Video"}
        </button>
      )}
    </div>
  );
}
