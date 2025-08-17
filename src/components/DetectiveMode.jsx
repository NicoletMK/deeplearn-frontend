import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const MIN_REASON_LEN = 10;
const MAX_REASON_LEN = 120;

const videos = [
  { url: "/videos/Fake1.mp4", label: "fake" },
  { url: "/videos/Fake3.mp4", label: "fake" },
  { url: "/videos/Fake4.mp4", label: "fake" },
  { url: "/videos/Real3.mp4", label: "real" },
  { url: "/videos/Real8.mp4", label: "real" },
  { url: "/videos/Fake6.mp4", label: "fake" },
  { url: "/videos/Fake8.mp4", label: "fake" },
  { url: "/videos/Fake11.mp4", label: "fake" },
  { url: "/videos/Fake12.mp4", label: "fake" },
  { url: "/videos/Fake99.mp4", label: "fake" },
];

// Knowledge-based & contextual clues
const FEATURE_OPTIONS = [
  "Lip-sync mismatch",
  "Mouth not matching voice",
  "Blinking looks odd / too regular",
  "Face edges / boundary artifacts",
  "Skin texture too smooth / waxy",
  "Lighting or shadows inconsistent",
  "Reflections don’t match (glasses/eyes)",
  "Hands / fingers look strange",
  "Motion is jittery or too smooth",
  "Audio sounds robotic / unnatural",
  "Background warps or shimmers",
  "Background looks unrealistic",
  "Compression artifacts pop in/out",
  "Temporal inconsistencies across frames",
  "Context seems unlikely / too perfect",
  "Historical / cultural inconsistency",
  "Scenario seems impossible / too perfect",
  "Everything looked real — I didn’t notice any AI clues"
];

const EVERYTHING_REAL = FEATURE_OPTIONS[FEATURE_OPTIONS.length - 1];
const EMOJIS = ["🎭", "🕶️", "😂", "💰", "📰", "🎤", "🧪", "🎬", "🧍", "🧠"];

// MediaPlayer and Chip components remain unchanged
function MediaPlayer({ src }) {
  return (
    <video controls className="w-full rounded shadow-xl max-w-xl">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

function Chip({ checked, label, onToggle, emphasis = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`px-3 py-2 rounded-full border transition text-sm md:text-base
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          checked
            ? "bg-blue-600 text-white border-blue-600"
            : emphasis
            ? "bg-yellow-100 border-yellow-400 hover:bg-yellow-200"
            : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
        }`}
    >
      {label}
    </button>
  );
}

export default function DetectiveMode({ session = "pre", onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [featureSet, setFeatureSet] = useState([]);
  const [otherFeature, setOtherFeature] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("deeplearnUserId");
    if (stored) setUserId(stored);
    else {
      const id = uuidv4();
      localStorage.setItem("deeplearnUserId", id);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    setFeatureSet([]);
    setOtherFeature("");
    setReasoning("");
    setConfidence(3);
    setSubmitted(false);
    setIsCorrect(null);
  }, [currentIndex]);

  const total = videos.length;
  const currentVideo = videos[currentIndex];

  const toggleClue = (label) => {
    setFeatureSet((prev) => {
      const has = prev.includes(label);
      if (label === EVERYTHING_REAL) return has ? [] : [EVERYTHING_REAL];
      const next = has ? prev.filter((l) => l !== label) : [...prev.filter((l) => l !== EVERYTHING_REAL), label];
      return next;
    });
  };

  const reasonLen = reasoning.trim().length;
  const hasRequiredClue = featureSet.length > 0;
  const reasonOk = reasonLen >= MIN_REASON_LEN;
  const canSubmit = hasRequiredClue && reasonOk;

  const getBadge = () => {
    const titles = ["Great Start, Detective!", "Clue Finder!", "Sharp Eyes!", "Final Case Solved!"];
    const emojis  = ["🕵️‍♀️", "🔍", "⚡", "🏆"];
    const idx = Math.min(currentIndex, titles.length - 1);
    const title = titles[idx];
    const emoji = emojis[idx];
    const desc =
      session === "post"
        ? isCorrect === true
          ? "✅ Correct! You're nailing these fakes."
          : isCorrect === false
          ? "❌ Not quite — the next case will sharpen your skills."
          : "Answer saved."
        : "Answer saved. On to the next case!";
    return { title, emoji, desc };
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitted) return;

    const correct = currentVideo.label === "fake";
    setIsCorrect(correct);
    setSubmitted(true);

    const payload = {
      userId,
      session,
      timestamp: new Date().toISOString(),
      video: currentVideo.url,
      label: currentVideo.label,
      cluesChosen: featureSet,
      otherFeature: otherFeature.trim() || null,
      reasoning: reasoning.trim(),
      confidence,
      correct
    };

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
      await fetch(`${backend}/api/detective`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("❌ Submission failed:", err);
    }

    setShowBadge(true);
  };

  const handleNext = () => {
    setShowBadge(false);
    if (currentIndex + 1 < total) setCurrentIndex(currentIndex + 1);
    else if (onComplete) onComplete();
  };

  const progressPct = Math.round(((currentIndex + (submitted ? 1 : 0)) / total) * 100);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-4">
      {/* ...rest of your existing JSX remains unchanged */}
    </div>
  );
}
