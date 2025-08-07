import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const MIN_REASON_LEN = 12; // Adjust as needed

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
  "Compression artifacts pop in/out",
  "Temporal inconsistencies across frames",
  "Context seems unlikely / too perfect"
];

// Media player that picks <video> for video extensions; otherwise <audio>
function MediaPlayer({ src }) {
  const ext = (src.split(".").pop() || "").toLowerCase();
  const isVideo = ["mp4", "webm", "mov"].includes(ext);

  if (isVideo) {
    const type = ext === "webm" ? "video/webm" : ext === "mov" ? "video/quicktime" : "video/mp4";
    return (
      <video controls className="w-full rounded shadow-xl max-w-xl">
        <source src={src} type={type} />
        Your browser does not support the video tag.
      </video>
    );
  }
  const type = ext === "mp3" ? "audio/mpeg" : "audio/mp4";
  return (
    <audio controls className="w-full rounded shadow-xl max-w-xl">
      <source src={src} type={type} />
      Your browser does not support the audio tag.
    </audio>
  );
}

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

/**
 * Props:
 * - videoPairs: array of { title?: string, videos: [{url,label}] }
 * - session: 'pre' | 'post'
 * - onComplete: optional callback
 */
export default function DetectiveMode({ videoPairs, session = "pre", onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]); // allow selecting one or both clips
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);     // only used in post
  const [isCorrect, setIsCorrect] = useState(null);

  // Answer board state
  const [featureSet, setFeatureSet] = useState([]);
  const [otherFeature, setOtherFeature] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState(3);

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

  // Reset state on group change
  useEffect(() => {
    setSelectedIndices([]);
    setSubmitted(false);
    setShowFeedback(false);
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

  // Randomize left/right per view, but keep stable while viewing a group
  const randomizedIndices = useMemo(() => {
    const order = [0, 1];
    if (Math.random() < 0.5) order.reverse();
    return order;
  }, [currentIndex]);

  const toggleClipSelection = (idxInView) => {
    if (submitted) return;
    setSelectedIndices((prev) =>
      prev.includes(idxInView) ? prev.filter((i) => i !== idxInView) : [...prev, idxInView]
    );
  };

  // Validation
  const hasClipSelection = selectedIndices.length > 0;
  const hasFeatureEvidence = featureSet.length > 0 || (otherFeature?.trim()?.length ?? 0) > 0;
  const hasReason = (reasoning?.trim()?.length ?? 0) >= MIN_REASON_LEN;
  const canSubmit = hasClipSelection && (hasFeatureEvidence || hasReason);

  const handleSubmit = async () => {
    if (submitted || !canSubmit) return;

    // Map selected (view) indices back to actual indices in the pair
    const selectedActual = selectedIndices.map((i) => randomizedIndices[i]).sort();
    const fakeSet = currentPair.videos
      .map((v, i) => (v.label === "fake" ? i : null))
      .filter((i) => i !== null)
      .sort();

    // Correct only if the sets match exactly (supports 0, 1, or 2 fakes)
    const allCorrect =
      selectedActual.length === fakeSet.length &&
      selectedActual.every((v, i) => v === fakeSet[i]);

    setSubmitted(true);

    if (session === "post") {
      setIsCorrect(allCorrect);
      setShowFeedback(true);
    }

    const payload = {
      userId,
      session,
      timestamp: new Date().toISOString(),
      pairIndex: currentIndex,
      groupTitle,
      selectedViewIndices: selectedIndices,        // [0..1] in view space
      selectedActualIndices: selectedActual,       // [0..1] actual indices
      groundTruthFakeIndices: fakeSet,             // [0..1]
      correct: allCorrect,
      videos: currentPair.videos.map((v) => v.url),
      prompts: {
        question1: "Which clip(s) do you think are AI-generated?",
        answer1: selectedIndices.map((i) => (i === 0 ? "Clip A" : "Clip B")),
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
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
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
    } else if (onComplete) {
      onComplete();
    }
  };

  // Reasoning counters
  const reasonLen = reasoning.trim().length;
  const reasonOk = reasonLen >= MIN_REASON_LEN;

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-4">
      <div className="bg-yellow-50 border-4 border-orange-400 rounded-2xl shadow-xl w-full max-w-6xl p-6 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-2">
          Detective Mode {session === "pre" ? "(Warm-Up Detective)" : "(Master Detective)"}
        </h1>

        <p className="text-base md:text-lg text-gray-800">
          Watch (or listen to) both clips. Select one or both clips you think are AI-generated, then submit.
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
            <div className="text-sm md:text-base text-gray-600">{groupSubtitle}</div>
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
              const selected = selectedIndices.includes(idxInView);
              return (
                <div key={idxInView} className="flex flex-col items-center">
                  <MediaPlayer src={media.url} />
                  <button
                    onClick={() => toggleClipSelection(idxInView)}
                    className={`mt-4 px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 text-lg
                      ${selected ? "bg-purple-600" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    {selected ? "Selected as AI-generated" : "Mark as AI-generated"}
                  </button>
                  <div className="mt-2 text-sm text-gray-500">
                    {idxInView === 0 ? "Clip A" : "Clip B"}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Question Prompts & Answer Board */}
        <div className="bg-white border-2 border-orange-300 rounded-xl text-left p-4 md:p-6 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-3">
            Question Prompts
          </h2>

          <div className="space-y-4">
            <div>
              <div className="font-semibold text-gray-900">
                1) Which clip(s) do you think are AI-generated?
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Toggle “Mark as AI-generated” above for Clip A and/or Clip B.
              </div>
              <div className="flex gap-3">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Clip A = Left
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Clip B = Right
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-900 mb-2">
                2) What features made you think that?{" "}
                <span className="text-gray-500">(Select all that apply)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FEATURE_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    checked={featureSet.includes(opt)}
                    onToggle={() =>
                      setFeatureSet((prev) =>
                        prev.includes(opt) ? prev.filter((f) => f !== opt) : [...prev, opt]
                      )
                    }
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

            <div>
              <div className="font-semibold text-gray-900 mb-2">
                3) Explain your reasoning in 1–3 sentences.
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder={`What clues did you notice? (${MIN_REASON_LEN}+ characters or pick at least one feature above)`}
                className="w-full border rounded-lg p-3"
              />
              <div className="mt-1 text-xs">
                <span className={`${reasonOk ? "text-green-700" : "text-red-600"}`}>
                  {reasonLen}/{MIN_REASON_LEN} {reasonOk ? "✓" : "characters needed"}
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-900 mb-2">
                4) How confident are you?{" "}
                <span className="text-gray-500">(1 = Not sure, 5 = Very sure)</span>
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

        {/* Submit / Feedback / Next */}
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
                    {!hasClipSelection && <li>Select at least one clip (Clip A and/or Clip B).</li>}
                    {hasClipSelection && !hasFeatureEvidence && !hasReason && (
                      <li>
                        Choose at least one feature <em>or</em> write a short reason ({MIN_REASON_LEN}+ characters).
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {submitted && session === "pre" && (
            <>
              {/* No correctness feedback in pre */}
              <div className="text-gray-700 text-lg">Answer saved.</div>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full"
              >
                {currentIndex === total - 1 ? "Finish" : "Next"}
              </button>
            </>
          )}

          {submitted && session === "post" && showFeedback && (
            <>
              <div
                className={`text-2xl font-semibold ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? "✅ Correct!" : "❌ Not quite."}
              </div>

              {/* Show ground-truth for transparency in post */}
              <div className="text-sm text-gray-700">
                Ground truth fakes:{" "}
                {currentPair.videos
                  .map((v, i) => (v.label === "fake" ? (i === 0 ? "Clip A" : "Clip B") : null))
                  .filter(Boolean)
                  .join(" & ") || "None"}
              </div>

              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full mt-2"
              >
                {currentIndex === total - 1 ? "Finish" : "Next"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
