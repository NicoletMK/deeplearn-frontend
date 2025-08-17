import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const MIN_REASON_LEN = 10;
const MAX_REASON_LEN = 120;

const EVERYTHING_REAL = "Everything looked real — I didn’t notice any AI clues";

const FEATURE_OPTIONS = [
  EVERYTHING_REAL,                
  "Lip-sync mismatch",
  "Odd or too regular blinking",
  "Face boundaries / edges look wrong",
  "Skin too smooth or waxy",
  "Lighting/shadows inconsistent",
  "Reflections don’t match",
  "Hands or fingers look strange",
  "Motion jittery or too smooth",
  "Audio sounds robotic or unnatural",
  "Background unrealistic or warping",
  "Temporal inconsistencies across frames",
  "Scenario or context seems impossible",
  "Historically or contextually unreasonable",
  "Expressions or emotions feel unnatural"
];



const EMOJIS = ["🎭", "🕶️", "😂", "💰", "📰", "🎤", "🧪", "🎬", "🧍", "🧠"];
 
const videos = [
  { url: "/videos/detection/Fake1.mp4", label: "fake" },
  { url: "/videos/detection/Fake3.mp4", label: "fake" },
  { url: "/videos/detection/Fake4.mp4", label: "fake" },
  { url: "/videos/detection/Real3.mp4", label: "real" },
  { url: "/videos/detection/Fake6.mp4", label: "fake" },
  { url: "/videos/detection/Fake8.mp4", label: "fake" },
  { url: "/videos/detection/Fake11.mp4", label: "fake" },
  { url: "/videos/detection/Real8.mp4", label: "real" },
  { url: "/videos/detection/Fake12.mp4", label: "fake" },
  { url: "/videos/detection/Fake99.mp4", label: "fake" },
];
 
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
      <div className="bg-yellow-50 border-4 border-blue-400 rounded-2xl shadow-xl w-full max-w-6xl p-6 md:p-10 text-center">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-1xl md:text-2xl font-extrabold text-blue-600">
            {session === "pre" ? "Warm-Up Detective" : "Master Detective"}
          </h1>
          <div className="text-sm font-semibold text-blue-700">
            {Math.min(currentIndex + (submitted ? 1 : 0), total)}/{total} done
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-3xl mx-auto h-3 bg-orange-200 rounded-full overflow-hidden mb-4">
          <div className="h-3 bg-blue-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Single video per screen */}
        <div className="mb-6 flex flex-col items-center">
          <MediaPlayer src={currentVideo.url} />
        </div>

        {/* Answer Board */}
        <div className="bg-white border-2 border-orange-300 rounded-xl text-left p-4 md:p-6 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-3 text-center">
            What clues did you notice?
          </h2>

          <div className="flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mb-4">
              {FEATURE_OPTIONS.map((opt, idx) => {
                const checked = featureSet.includes(opt);
                const isEverything = opt === EVERYTHING_REAL;
                const disableThis =
                  (featureSet.includes(EVERYTHING_REAL) && !isEverything) ||
                  (isEverything && featureSet.some((o) => o !== EVERYTHING_REAL));
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    checked={checked}
                    onToggle={() => toggleClue(opt)}
                    emphasis={idx === 0}
                    disabled={disableThis || submitted}
                  />
                );
              })}
            </div>

            <input
              type="text"
              value={otherFeature}
              onChange={(e) => setOtherFeature(e.target.value)}
              placeholder="Other clue you noticed (optional)"
              className="w-full border rounded-lg p-2 mb-4"
              disabled={featureSet.includes(EVERYTHING_REAL) || submitted}
            />

            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={3}
              maxLength={MAX_REASON_LEN}
              placeholder={`Required: write a short reason (≥ ${MIN_REASON_LEN} characters).`}
              className="mt-2 w-full border rounded-lg p-3 mb-2"
              disabled={submitted}
            />
            <div className="mt-1 text-xs">
              <span className={reasonOk ? "text-green-700" : "text-red-600"}>
                {reasonLen}/{MAX_REASON_LEN} {reasonOk ? "✓" : `characters (≥${MIN_REASON_LEN} needed)`}
              </span>
            </div>

            <div className="mt-4 w-full flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={5}
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full"
                disabled={submitted}
              />
              <div className="w-10 text-center font-semibold">{confidence}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-8 py-3 text-white text-lg font-bold rounded-full
                ${!canSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>

      {showBadge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-yellow-200 p-8 max-w-md w-full text-center">
            {(() => {
              const { title, emoji, desc } = getBadge();
              return (
                <>
                  <div className="text-6xl mb-3">{emoji}</div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">{title}</h2>
                  <p className="text-gray-800 mb-6">{desc}</p>
                </>
              );
            })()}
            <button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
            >
              {currentIndex === total - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
