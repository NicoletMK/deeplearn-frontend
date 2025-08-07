import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";


const GROUP_TITLES = [
  "Famous Faces Speaking Out",   // 1 Celebrity Speeches
  "Tech Visionary Speaks",       // 2 Elon Musk's Talks
  "Science in Action",           // 3 Scientists' Talks
  "Tales of Legends",            // 4 Giants Stories
  "Laugh Out Loud",              // 5 Funny Videos
  "Meet the Guys",               // 6 Men's Intro
  "Acts of Kindness",            // 7 Charity
  "Breaking Stories",            // 8 News
  "Action & Moves",              // 9 Motions
  "Style on Screen"              // 10 Fashion Commercials
];

const GROUP_SUBTITLES = [
  "Public speeches by famous people",
  "Talks from a well-known tech leader",
  "Scientists sharing discoveries",
  "Stories about larger-than-life figures",
  "Clips made to make you giggle",
  "Short introductions from different men",
  "Doing good and helping others",
  "Current events and reports",
  "High-energy action and dramatic moves",
  "Trendy ads and fashion moments"
];

const FEATURE_OPTIONS = [
  "Lip-sync mismatch",
  "Mouth not matching voice",
  "Blinking looks odd / too regular",
  "Face edges / boundary artifacts",
  "Skin texture looks too smooth / waxy",
  "Lighting or shadows inconsistent",
  "Reflections don’t match (glasses/eyes)",
  "Hands / fingers look strange",
  "Motion is jittery or too smooth",
  "Audio sounds robotic / unnatural",
  "Background warps or shimmers",
  "Compression artifacts pop in/out",
  "Temporal inconsistencies across frames",
  "Context seems unlikely / too perfect"
];


const DEFAULT_VIDEO_PAIRS = [
  { videos: [
      { url: "/videos/detection/Real1.mp3", label: "real" },
      { url: "/videos/detection/Fake1.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake2.mp3", label: "fake" },
      { url: "/videos/detection/Fake22.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake3.mp3", label: "fake" },
      { url: "/videos/detection/Real3.mp3", label: "real" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake4.mp3", label: "fake" },
      { url: "/videos/detection/Fake44.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake5.mp3", label: "fake" },
      { url: "/videos/detection/Fake55.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake6.mp3", label: "fake" },
      { url: "/videos/detection/Real6.mp3", label: "real" }
    ]},
  { videos: [
      { url: "/videos/detection/Real7.mp3", label: "real" },
      { url: "/videos/detection/Fake7.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Real8.mp3", label: "real" },
      { url: "/videos/detection/Fake8.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake9.mp3", label: "fake" },
      { url: "/videos/detection/Fake99.mp3", label: "fake" }
    ]},
  { videos: [
      { url: "/videos/detection/Fake10.mp3", label: "fake" },
      { url: "/videos/detection/Fake11.mp3", label: "fake" }
    ]}
];

/**
 * Simple media player that chooses <video> for typical video extensions; else <audio>.
 */
function MediaPlayer({ src }) {
  const ext = (src.split(".").pop() || "").toLowerCase();
  const isVideo = ["mp4", "webm", "mov"].includes(ext);

  if (isVideo) {
    const type =
      ext === "webm" ? "video/webm" :
      ext === "mov" ? "video/quicktime" : "video/mp4";
    return (
      <video controls className="w-full rounded shadow-xl max-w-xl">
        <source src={src} type={type} />
        Your browser does not support the video tag.
      </video>
    );
  }

  // audio
  const type = ext === "mp3" ? "audio/mpeg" : "audio/mp4";
  return (
    <audio controls className="w-full rounded shadow-xl max-w-xl">
      <source src={src} type={type} />
      Your browser does not support the audio tag.
    </audio>
  );
}

/**
 * Little chip-style checkbox
 */
function Chip({ checked, label, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1 rounded-full border transition
        ${checked ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"}`}
    >
      {label}
    </button>
  );
}

export default function DetectiveMode({
  videoPairs = DEFAULT_VIDEO_PAIRS,
  session = "pre",
  onComplete
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [guessIndex, setGuessIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Answer Board state
  const [featureSet, setFeatureSet] = useState([]);      // array of FEATURE_OPTIONS that are selected
  const [otherFeature, setOtherFeature] = useState("");  // free-form "other" feature
  const [reasoning, setReasoning] = useState("");        // short explanation
  const [confidence, setConfidence] = useState(3);       // 1..5 scale

  // Persist a user id
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

  // Reset answer board on group change
  useEffect(() => {
    setFeatureSet([]);
    setOtherFeature("");
    setReasoning("");
    setConfidence(3);
  }, [currentIndex]);

  // Guard
  const total = videoPairs?.length || 0;
  if (!videoPairs || total === 0) {
    return (
      <div className="text-center py-10 text-red-600">
        ⚠️ No videos available
      </div>
    );
  }

  const currentPair = videoPairs[currentIndex];
  const groupTitle = GROUP_TITLES[currentIndex] || `Group ${currentIndex + 1}`;
  const groupSubtitle = GROUP_SUBTITLES[currentIndex] || "";

  // Randomize left/right per group view
  const randomizedIndices = useMemo(() => {
    const order = [0, 1];
    if (Math.random() < 0.5) order.reverse();
    return order;
  }, [currentIndex]);

  const toggleFeature = (label) => {
    setFeatureSet((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const handleGuess = async (indexInView) => {
    if (showFeedback) return;

    const actualIndex = randomizedIndices[indexInView];
    const selected = currentPair.videos[actualIndex];
    const correct = selected.label === "fake";

    setGuessIndex(indexInView);
    setIsCorrect(correct);
    setShowFeedback(true);

    const payload = {
      userId,
      session,
      timestamp: new Date().toISOString(),
      pairIndex: currentIndex,
      groupTitle,
      selectedIndex: actualIndex,
      selectedUrl: selected.url,
      actualLabel: selected.label,
      correct,
      videos: currentPair.videos.map((v) => v.url),

      // Answer Board data
      prompts: {
        question1: "Which one do you think is AI-generated?",
        answer1: indexInView === 0 ? "Left / Clip A" : "Right / Clip B",
        question2: "What features made you think that? (Select all that apply)",
        answer2: featureSet,
        question3: "Anything else you noticed?",
        answer3: otherFeature?.trim() || null,
        question4: "Explain your reasoning in 1–3 sentences.",
        answer4: reasoning?.trim() || null,
        question5: "How confident are you? (1=Not sure, 5=Very sure)",
        answer5: confidence
      }
    };

    try {
      const backend =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
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
    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1);
      setGuessIndex(null);
      setIsCorrect(null);
      setShowFeedback(false);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-4">
      <div className="bg-yellow-50 border-4 border-orange-400 rounded-2xl shadow-xl w-full max-w-6xl p-6 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-2">
          Detective Mode {session === "pre" ? "(Before Creation)" : "(After Creation)"}
        </h1>

        <p className="text-base md:text-lg text-gray-800">
          Watch (or listen to) both clips. Which one is fake?
        </p>

        <div className="mt-1 mb-4">
          <div className="text-sm md:text-base text-gray-700">
            Group <span className="font-semibold">{currentIndex + 1}</span> of{" "}
            <span className="font-semibold">{total}</span>
          </div>
          <div className="text-xl md:text-2xl font-semibold text-gray-900 mt-1">
            {groupTitle}
          </div>
          {groupSubtitle && (
            <div className="text-sm md:text-base text-gray-600">
              {groupSubtitle}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-3xl mx-auto h-3 bg-orange-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-3 bg-orange-500"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-6"
          >
            {randomizedIndices.map((pairIdxInPair, idxInView) => {
              const media = currentPair.videos[pairIdxInPair];
              return (
                <div key={idxInView} className="flex flex-col items-center">
                  <MediaPlayer src={media.url} />
                  <button
                    onClick={() => handleGuess(idxInView)}
                    disabled={showFeedback}
                    className={`mt-4 px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 text-lg
                      ${
                        showFeedback
                          ? idxInView === guessIndex && isCorrect
                            ? "bg-green-600"
                            : idxInView === guessIndex
                            ? "bg-red-600"
                            : "bg-gray-400"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    Select as Fake
                  </button>
                  <div className="mt-2 text-sm text-gray-500">
                    {idxInView === 0 ? "Clip A" : "Clip B"}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ------------------ Question Prompts & Answer Board ------------------ */}
        <div className="bg-white border-2 border-orange-300 rounded-xl text-left p-4 md:p-6 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-3">
            Question Prompts
          </h2>

          <div className="space-y-4">
            {/* Q1 */}
            <div>
              <div className="font-semibold text-gray-900">
                1) Which one do you think is AI-generated?
              </div>
              <div className="text-sm text-gray-600 mb-2">
                You’ll still need to press a “Select as Fake” button above to lock in your answer.
              </div>
              <div className="flex gap-3">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700">Clip A = Left</span>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700">Clip B = Right</span>
              </div>
            </div>

            {/* Q2 */}
            <div>
              <div className="font-semibold text-gray-900 mb-2">
                2) What features made you think that? <span className="text-gray-500">(Select all that apply)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FEATURE_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    checked={featureSet.includes(opt)}
                    onToggle={() => toggleFeature(opt)}
                  />
                ))}
              </div>
              <input
                type="text"
                value={otherFeature}
                onChange={(e) => setOtherFeature(e.target.value)}
                placeholder="Other feature you noticed (optional)"
                className="mt-3 w-full border rounded-lg p-2"
              />
            </div>

            {/* Q3 */}
            <div>
              <div className="font-semibold text-gray-900 mb-2">
                3) Explain your reasoning in 1–3 sentences.
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder="What clues did you notice? How did they help you decide?"
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* Q4 */}
            <div>
              <div className="font-semibold text-gray-900 mb-2">
                4) How confident are you? <span className="text-gray-500">(1 = Not sure, 5 = Very sure)</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="w-10 text-center font-semibold">{confidence}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback & Next */}
        {showFeedback && (
          <div
            className={`text-2xl font-semibold mt-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}
          >
            {isCorrect
              ? "✅ Correct! You spotted the fake."
              : "❌ Not quite! That was the real one."}
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            className="mt-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full"
          >
            {currentIndex === total - 1 ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
