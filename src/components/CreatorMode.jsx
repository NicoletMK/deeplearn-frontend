// src/pages/CreatorMode.jsx
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../utils/firebaseConfig";
import { creatorVideos } from "../data/creatorVideos";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function CreatorMode({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");

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

  const videos = creatorVideos || [];

  if (!videos.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <p className="text-xl text-red-600 font-bold">⚠️ No videos available for Creator Mode.</p>
      </div>
    );
  }

  const current = videos[currentIndex];

  const handleNext = async () => {
    const payload = {
      userId,
      videoId: current.id,
      character: current.character,
      index: current.index,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "creatorSessions"), payload);
    } catch (err) {
      console.error("❌ Failed to save Creator data:", err);
    }

    if (currentIndex + 1 < videos.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">🎬 Creator Mode</h1>
      <p className="text-blue-900 mb-6 text-center max-w-xl">
        Watch this character video and imagine what you'd say if you could control their voice.
      </p>
      <video key={current.url} controls className="w-full max-w-md rounded-lg shadow-lg mb-4">
        <source src={current.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <audio controls className="mb-6">
        <source src={current.audio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={handleNext}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-bold rounded-full"
      >
        {currentIndex === videos.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
