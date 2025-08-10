import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const MIN_REASON_LEN = 10;
const MAX_REASON_LEN = 120;

const GROUP_SUBTITLES = {
  "Famous Faces Speaking Out": "Public speeches by famous people",
  "Tech Visionary Speaks": "Talks from a well-known tech leader",
  "Science in Action": "Scientists sharing discoveries",
  "Tales of Legends": "Stories about larger-than-life figures",
  "Laugh Out Loud": "Clips made to make you giggle",
  "Meet the Guys": "Short introductions from different men",
  "Acts of Kindness": "Doing good and helping others",
  "Breaking Stories": "Current events and reports",
  "Action & Moves": "High-energy action and dramatic moves",
  "Style on Screen": "Trendy ads and fashion moments"
};

// Special, mutually exclusive option
const EVERYTHING_REAL = "Everything looked real — I didn’t notice any AI clues";

const FEATURE_OPTIONS = [
  EVERYTHING_REAL,
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
  "Context seems unlikely / too perfect"
];

// Emoji per step (fallback to 🧩 if more steps than emojis)
const EMOJIS = ["🎭", "🕶️", "😂", "💰", "📰", "🎤", "🧪", "🎬", "🧍", "🧠"];

// Video-only player (all assets are .mp4)
function MediaPlayer({ src, onPlay, onPause, onSeek }) {
  return (
    <video
      controls
      className="w-full rounded shadow-xl max-w-xl"
      onPlay={onPlay}
      onPause={onPause}
      onSeeked={(e) => onSeek && onSeek(e.currentTarget.currentTime)}
    >
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

/**
 * Props:
 * - videoPairs: [{ title?: string, videos: [{url,label}] }]
 * - session: 'pre' | 'post'
 * - onComplete?: () => void
 */
export default function DetectiveMode({ videoPairs, session = "pre", onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]); // [], [0], [1], or [0,1]
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Answer board
  const [featureSet, setFeatureSet] = useState([]); // must include >= 1 (EVERYTHING_REAL counts)
  const [otherFeature, setOtherFeature] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState(3);

  // Gamification badge modal
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
    // reset on group change
    setSelectedIndices([]);
    setSubmitted(false);
    setIsCorrect(null);
    setFeatureSet([]);
    setOtherFeature("");
    setReasoning("");
    setConfidence(3);
  }, [currentIndex]);

  const total = videoPairs?.length || 0;
  if (!videoPairs || total === 0) {
    return <div className="text-center py-10 text-red-600">⚠️ No videos available</div>;
  }

  const currentPair = videoPairs[currentIndex];
  const groupTitle = currentPair.title || `Group ${currentIndex + 1}`;
  const groupSubtitle = GROUP_SUBTITLES[groupTitle] || "";

  // Randomize left/right per group view
  const randomizedIndices = useMemo(() => {
    const order = [0, 1];
    if (Math.random() < 0.5) order.reverse();
    return order;
  }, [currentIndex]);

  const toggleClip = (idxInView) => {
    if (submitted) return;
    setSelectedIndices((prev) =>
      prev.includes(idxInView) ? prev.filter((i) => i !== idxInView) : [...prev, idxInView]
    );
  };

  // Clue selection rules:
  // - User must choose at least one FEATURE_OPTIONS item.
  // - EVERYTHING_REAL is mutually exclusive with all other clues.
  const toggleClue = (label) => {
    setFeatureSet((prev) => {
      const has = prev.includes(label);
      if (label === EVERYTHING_REAL) {
        // Selecting this clears all others
        return has ? [] : [EVERYTHING_REAL];
      }
      // Selecting any other clue removes EVERYTHING_REAL if present
      const next = has ? prev.filter((l) => l !== label) : [...prev.filter((l) => l !== EVERYTHING_REAL), label];
      return next;
    });
  };

  // ===== Validation =====
  const hasRequiredClue = featureSet.length > 0;
  const reasonLen = reasoning.trim().length;
  const reasonOk = reasonLen >= MIN_REASON_LEN;
  const canSubmit = hasRequiredClue && reasonOk;

  // Encouragement badge content
  const getBadge = () => {
    // Theme by index (feel free to tweak messages)
    const titles = ["Great Start, Detective!", "Clue Finder!", "Sharp Eyes!", "Final Case Solved!"];
    const emojis  = ["🕵️‍♀️", "🔍", "⚡", "🏆"];
    const idx = Math.min(currentIndex, titles.length - 1);
    const title = titles[idx];
    const emoji = emojis[idx];
    // In post-session, include correctness
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
    if (submitted || !canSubmit) return;

    const selectedActual = selectedIndices.map((i) => randomizedIndices[i]).sort();
    const fakeSet = currentPair.videos
      .map((v, i) => (v.label === "fake" ? i : null))
      .filter((i) => i !== null)
      .sort();

    const allCorrect =
      selectedActual.length === fakeSet.length &&
      selectedActual.every((v, i) => v === fakeSet[i]);

    setSubmitted(true);
    setIsCorrect(allCorrect);

    const payload = {
      userId,
      session,
      timestamp: new Date().toISOString(),
      pairIndex: currentIndex,
      groupTitle,
      selectedViewIndices: selectedIndices,   // view-space
      selectedActualIndices: selectedActual,  // actual indices
      groundTruthFakeIndices: fakeSet,
      correct: allCorrect,
      videos: currentPair.videos.map((v) => v.url),
      prompts: {
        cluesChosen: featureSet,                    // includes EVERYTHING_REAL if picked
        otherFeature: otherFeature.trim() || null,  // optional free text
        reasoning: reasoning.trim(),               // required
        confidence
      }
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

    // Show encouragement badge (with correctness if post)
    setShowBadge(true);
  };

  const handleNext = () => {
    setShowBadge(false);
    if (currentIndex + 1 < total) setCurrentIndex(currentIndex + 1);
    else if (onComplete) onComplete();
  };

  const sessionTitle = session === "pre" ? "Warm-Up Detective" : "Master Detective";

  // Progress percent for bar
  const progressPct = Math.round(((currentIndex + (submitted ? 1 : 0)) / total) * 100);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-4">
      <div className="bg-yellow-50 border-4 border-orange-400 rounded-2xl shadow-xl w-full max-w-6xl p-6 md:p-10 text-center">
        {/* Header + progress */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600">{sessionTitle}</h1>
          <div className="text-sm font-semibold text-orange-700">
            {Math.min(currentIndex + (submitted ? 1 : 0), total)}/{total} done
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-3xl mx-auto h-3 bg-orange-200 rounded-full overflow-hidden mb-2">
          <div className="h-3 bg-orange-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Emoji step dots (done/current/locked) */}
        <div className="flex justify-center gap-3 mb-4">
          {videoPairs.map((_, i) => {
            const isDone = i < currentIndex || (i === currentIndex && submitted);
            const isCurrent = i === currentIndex && !submitted;
            const emoji = EMOJIS[i] || "🧩";
            return (
              <div key={i} className="relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xl shadow
                    ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-orange-500 text-white" : "bg-blue-200 text-blue-900"}`}
                  title={`Case ${i + 1}`}
                >
                  {emoji}
                </div>
                {isDone && (
                  <div className="absolute -top-2 -right-2">✅</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Centered, easy-to-read instructions with emojis */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 border-2 border-orange-300 rounded-2xl p-6 md:p-8 text-gray-900 text-center shadow-md">
            <p className="text-xl font-bold text-orange-700 mb-3">
              🎥👀 Watch both clips carefully.
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-3">
              ☑️🤖 Check the clip(s) you believe are AI-generated. Leave both unchecked if you think both are real.
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-3">
              🔍💡 Pick <span className="font-semibold text-orange-700">at least one</span> clue below.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              ✏️🗒️ Write a brief reason. Then submit to unlock the next case!
            </p>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <div className="text-sm md:text-base text-gray-700">
            Case <span className="font-semibold">{currentIndex + 1}</span> of{" "}
            <span className="font-semibold">{total}</span>
          </div>
          <div className="text-xl md:text-2xl font-semibold text-gray-900 mt-1">
            {groupTitle}
          </div>
          {groupSubtitle && (
            <div className="text-sm md:text-base text-gray-600">{groupSubtitle}</div>
          )}
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
              const selected = selectedIndices.includes(idxInView);
              return (
                <div key={idxInView} className="flex flex-col items-center">
                  <MediaPlayer
                    src={media.url}
                    onPlay={() => {/* add analytics if desired */}}
                    onPause={() => {/* add analytics if desired */}}
                    onSeek={() => {/* add analytics if desired */}}
                  />
                  <label className="mt-3 flex items-center gap-2 text-sm md:text-base">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selected}
                      onChange={() => toggleClip(idxInView)}
                      disabled={submitted}
                    />
                    Mark {idxInView === 0 ? "Clip A (Left)" : "Clip B (Right)"} as AI-generated
                  </label>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Answer Board */}
        <div className="bg-white border-2 border-orange-300 rounded-xl text-left p-4 md:p-6 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-3 text-center">
            What clues did you notice?
          </h2>

          {/* Clue chips - centered and clean */}
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
              {FEATURE_OPTIONS.map((opt, idx) => {
                const checked = featureSet.includes(opt);
                const isEverything = opt === EVERYTHING_REAL;
                // If EVERYTHING_REAL is selected, other chips are disabled; if any other is selected, EVERYTHING_REAL is disabled
                const disableThis =
                  (featureSet.includes(EVERYTHING_REAL) && !isEverything) ||
                  (isEverything && featureSet.some((o) => o !== EVERYTHING_REAL));
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    checked={checked}
                    onToggle={() => toggleClue(opt)}
                    emphasis={idx === 0} // highlight the "Everything looked real" option
                    disabled={disableThis || submitted}
                  />
                );
              })}
            </div>

            {/* Optional free-text & reason */}
            <div className="mt-4 w-full max-w-3xl">
              <input
                type="text"
                value={otherFeature}
                onChange={(e) => setOtherFeature(e.target.value)}
                placeholder="Other clue you noticed (optional)"
                className="w-full border rounded-lg p-2"
                disabled={featureSet.includes(EVERYTHING_REAL) || submitted}
              />
            </div>

            <div className="mt-4 w-full max-w-3xl">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">
                  Explain your reasoning in 1–3 sentences
                  <span className="ml-2 text-gray-500">({MIN_REASON_LEN}/{MAX_REASON_LEN} required)</span>
                </div>
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                maxLength={MAX_REASON_LEN}
                placeholder={`Required: write a short reason (≥ ${MIN_REASON_LEN} characters).`}
                className="mt-2 w-full border rounded-lg p-3"
                disabled={submitted}
              />
              <div className="mt-1 text-xs">
                <span className={reasonOk ? "text-green-700" : "text-red-600"}>
                  {reasonLen}/{MAX_REASON_LEN} {reasonOk ? "✓" : `characters (≥${MIN_REASON_LEN} needed)`}
                </span>
              </div>
            </div>

            <div className="mt-4 w-full max-w-3xl">
              <div className="font-semibold text-gray-900 mb-2">
                How confident are you? <span className="text-gray-500">(1 = Not sure, 5 = Very sure)</span>
              </div>
              <div className="flex items-center gap-3">
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
        </div>

        {/* Submit / Next */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {!submitted && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 text-white text-lg font-bold rounded-full
                  ${!canSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                Submit Answer
              </button>

              {!canSubmit && (
                <div className="text-sm text-gray-700 text-center max-w-xl">
                  To submit, please:
                  <ul className="list-disc list-inside text-left">
                    {!hasRequiredClue && <li>Choose at least <strong>one</strong> clue above.</li>}
                    {!reasonOk && <li>Write a brief reason (≥ {MIN_REASON_LEN} characters).</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Badge modal after submit (encouragement + correctness if post) */}
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
