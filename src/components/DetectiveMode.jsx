import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const MIN_REASON_LEN = 10;
const MAX_REASON_LEN = 120;
const EVERYTHING_REAL = "Everything looked real — no AI clues in this video";

const FEATURE_OPTIONS = [
  "Lip-sync mismatch",
  "Odd or too regular blinking",
  "Face boundaries / edges look wrong",
  "Skin too smooth or waxy",
  "Expressions or emotions feel unnatural",
  "Lighting/shadows inconsistent",
  "Reflections don’t match",
  "Hands or fingers look strange",
  "Motion jittery or too smooth",
  "Audio sounds robotic or unnatural",
  "Background unrealistic or warping",
  "Temporal inconsistencies across frames",
  "Scenario or context seems impossible",
  "Historically or contextually unreasonable"
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
  { url: "/videos/detection/Fake99.mp4", label: "fake" }
];

function MediaPlayer({ src }) {
  return (
    <video controls className="w-full rounded shadow-xl max-w-xl">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

function BigChoiceButton({ active, color, icon, label, sublabel, onClick, disabled }) {
  // Base styles for active vs inactive
  const activeCls = active
    ? `bg-${color}-600 text-white border-${color}-700`
    : `bg-white text-${color}-700 border-${color}-400 hover:bg-${color}-50`;

  // Handle disabled state
  const disabledCls = disabled
    ? active
      ? `bg-${color}-600 text-white border-${color}-700 cursor-not-allowed opacity-80` // preserve active color
      : `bg-gray-200 text-gray-700 border-gray-300 cursor-not-allowed opacity-80`
    : "";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 md:px-8 py-4 md:py-5 rounded-2xl border-4 text-lg md:text-xl font-extrabold shadow-md flex items-center gap-3 transition
        ${activeCls} ${disabledCls}
      `}
    >
      <span className="text-2xl md:text-3xl">{icon}</span>
      <div className="text-left leading-tight">
        <div>{label}</div>
        {sublabel && <div className="text-xs md:text-sm opacity-90 font-medium">{sublabel}</div>}
      </div>
    </motion.button>
  );
}



function Chip({ checked, label, onToggle, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={`px-3 py-2 rounded-full border transition text-sm md:text-base shadow-sm
        ${checked ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300"}
        ${disabled ? "bg-gray-200 text-gray-700 border-gray-300 cursor-not-allowed" : "hover:bg-blue-50"}
      `}
    >
      {label}
    </motion.button>
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
  const [videoChoice, setVideoChoice] = useState(""); // 'real' | 'fake'
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
    setVideoChoice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const total = videos.length;
  const currentVideo = videos[currentIndex];

  const handleVideoChoice = (choice) => {
    setVideoChoice(choice);
    if (choice === "real") {
      setFeatureSet([EVERYTHING_REAL]);
      setOtherFeature("");
    } else if (choice === "fake") {
      setFeatureSet((prev) => prev.filter((f) => f !== EVERYTHING_REAL));
    }
  };

  const toggleClue = (label) => {
    if (videoChoice !== "fake") return;
    setFeatureSet((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const reasonLen = reasoning.trim().length;
  const hasRequiredClue = videoChoice === "real" ? true : featureSet.length > 0;
  const reasonOk = reasonLen >= MIN_REASON_LEN;
  const canSubmit = Boolean(videoChoice) && hasRequiredClue && reasonOk && Number.isFinite(confidence);

const confidenceLabel = (v) => {
  switch (v) {
    case 1:
      return "Wild guess🎲";
    case 2:
      return "Somewhat unsure🤔";
    case 3:
      return "Fairly confident🕵️ ";
    case 4:
      return "Pretty sure✅";
    case 5:
      return "Expert-level confidence💯";
    default:
      return "";
  }
};


  const getBadge = () => {
    const titles = ["Great Start, Detective!", "Clue Finder!", "Sharp Eyes!", "Final Case Solved!"];
    const emojis = ["🕵️‍♀️", "🔍", "⚡", "🏆"];
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
      videoIndex: currentIndex,
      video: currentVideo.url,
      label: currentVideo.label,
      userLabel: videoChoice,
      cluesChosen: videoChoice === "real" ? [EVERYTHING_REAL] : featureSet,
      otherFeature: videoChoice === "real" ? null : (otherFeature.trim() || null),
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

  const sessionTitle = session === "pre" ? "Warm-Up Detective" : "Master Detective";
  const progressPct = Math.round(((currentIndex + (submitted ? 1 : 0)) / total) * 100);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-4">
      <div className="bg-yellow-50 border-4 border-blue-400 rounded-2xl shadow-xl w-full max-w-6xl p-6 md:p-10 text-center">
        {/* Header + Progress */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-extrabold text-blue-600">{sessionTitle}</h1>
          <div className="text-sm font-semibold text-blue-700">
            {Math.min(currentIndex + (submitted ? 1 : 0), total)}/{total} done
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto h-3 bg-orange-200 rounded-full overflow-hidden mb-4">
          <div className="h-3 bg-blue-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Emoji step dots */}
        <div className="flex justify-center gap-3 mb-4">
          {videos.map((_, i) => {
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
                {isDone && <div className="absolute -top-2 -right-2">✅</div>}
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-white/80 border-2 border-orange-300 rounded-2xl p-6 md:p-8 text-gray-900 text-center shadow-md">
            <p className="text-base md:text-lg leading-relaxed mb-3">🎥 Watch the clip and pick your verdict.</p>
            <p className="text-base md:text-lg leading-relaxed mb-3">Choose <strong>Real</strong> if everything looked real — no AI tricks spotted!</p>
            <p className="text-base md:text-lg leading-relaxed mb-3">Choose <strong>AI</strong> and click all the clues that gave it away.</p>
            <p className="text-base md:text-lg leading-relaxed">📝 Drop a short detective note and your confidence.</p>
          </div>
        </div>

        {/* Video Player */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center mb-6"
          >
            <MediaPlayer src={currentVideo.url} />
          </motion.div>
        </AnimatePresence>

        {/* Big Real / AI choice */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-2">
          <BigChoiceButton
            active={videoChoice === "real"}
            color="green"
            icon="✅"
            label="Real"
            sublabel="Everything looked real — no AI clues"
            onClick={() => handleVideoChoice("real")}
            disabled={submitted}
          />
          <BigChoiceButton
            active={videoChoice === "fake"}
            color="red"
            icon="🤖"
            label="AI"
            sublabel="Spot the glitch and pick clues"
            onClick={() => handleVideoChoice("fake")}
            disabled={submitted}
          />
        </div>

        {/* AI Clues Drawer (only when AI chosen) */}
        <AnimatePresence initial={false}>
          {videoChoice === "fake" && (
            <motion.div
              key="clues"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="bg-white border-2 border-orange-300 rounded-xl text-left p-4 md:p-6 max-w-4xl mx-auto mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-3 text-center">What clues did you notice?</h2>
                <div className="flex flex-col items-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-3xl mb-4">
                    {FEATURE_OPTIONS.map((opt) => (
                      <Chip
                        key={opt}
                        label={opt}
                        checked={featureSet.includes(opt)}
                        onToggle={() => toggleClue(opt)}
                        disabled={submitted}
                      />
                    ))}
                  </div>

                  {/* Optional free-text when AI */}
                  <div className="mt-2 w-full max-w-3xl">
                    <input
                      type="text"
                      value={otherFeature}
                      onChange={(e) => setOtherFeature(e.target.value)}
                      placeholder="Other clue you noticed (optional)"
                      disabled={submitted}
                      className={`w-full border rounded-lg p-2
                        ${submitted ? "bg-gray-200 text-gray-700 border-gray-300 cursor-not-allowed" : "bg-white text-gray-800 border-gray-300 focus:ring focus:ring-blue-200"}
                      `}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reasoning */}
        <div className="bg-white/90 border-2 border-blue-200 rounded-xl p-4 md:p-6 max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">
              Drop your detective note (1–3 sentences)
              <span className="ml-2 text-gray-500">({MIN_REASON_LEN}/{MAX_REASON_LEN} required)</span>
            </div>
          </div>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={3}
            maxLength={MAX_REASON_LEN}
placeholder={
  videoChoice === "real"
    ? "Why does this feel authentic? Think about lighting, shadows, natural motion, facial expressions, edges, context, or other subtle cues that make it believable…"
    : "What gave the AI away? Look for facial expressions, reflections, lighting, background, context, inconsistencies, historical or factual errors, or other clues…"
}
            disabled={submitted}
            className={`mt-2 w-full border rounded-lg p-3
              ${submitted ? "bg-gray-200 text-gray-700 border-gray-300 cursor-not-allowed" : "bg-white text-gray-800 border-gray-300 focus:ring focus:ring-blue-200"}
            `}
          />
          <div className="mt-1 text-xs">
            <span className={reasonOk ? "text-green-700" : "text-red-600"}>
              {reasonLen}/{MAX_REASON_LEN} {reasonOk ? "✓" : `characters (≥${MIN_REASON_LEN} needed)`}
            </span>
          </div>
        </div>

 {/* Confidence */}
<div className="bg-white/90 border-2 border-green-200 rounded-xl p-4 md:p-6 max-w-4xl mx-auto mb-6">
  <div className="font-semibold text-gray-900 mb-2">
    How confident are you? <span className="text-gray-500">(1 = Not sure, 5 = Very sure)</span>
  </div>

  {/* Icons / tooltips above slider */}
  <div className="flex justify-between mb-1">
    {[
      "🎲", // 1
      "🤔", // 2
      "🕵️", // 3
      "✅", // 4
      "💯"  // 5
    ].map((icon, idx) => (
      <div key={idx} className="text-center w-1/5 text-lg md:text-xl">
        <span className={`transition-transform ${confidence === idx + 1 ? "scale-125" : ""}`}>
          {icon}
        </span>
      </div>
    ))}
  </div>

  {/* Slider */}
  <input
    type="range"
    min={1}
    max={5}
    value={confidence}
    onChange={(e) => setConfidence(parseInt(e.target.value))}
    disabled={submitted}
    className={`w-full accent-transparent h-2 rounded-full appearance-none
      ${submitted ? "cursor-not-allowed" : ""}
    `}
    style={{
      background: `linear-gradient(to right, 
        ${["#f87171","#fbbf24","#facc15","#34d399","#22c55e"][confidence-1]} 0%, 
        ${["#f87171","#fbbf24","#facc15","#34d399","#22c55e"][confidence-1]} ${(confidence-1)/4*100}%, 
        #e5e7eb ${(confidence-1)/4*100}%, #e5e7eb 100%)`
    }}
  />

  {/* Labels below slider */}
  <div className="flex justify-between mt-2 text-sm md:text-base font-medium">
    {[
      "1. Just guessing",
      "2. Somewhat unsure",
      "3. Fairly confident",
      "4. Pretty sure",
      "5. Expert-level"
    ].map((label, idx) => (
      <span
        key={idx}
        className={`transition-colors ${
          confidence === idx + 1 ? "text-blue-600 font-bold" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    ))}
  </div>
</div>


        {/* Submit / Next */}
        <div className="mt-2 flex flex-col items-center gap-3">
          {!submitted && (
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 text-white text-lg font-bold rounded-full shadow-md
                  ${!canSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                Submit Answer
              </motion.button>

              {!canSubmit && (
                <div className="text-sm text-gray-700 text-center max-w-xl">
                  To submit, please:
                  <ul className="list-disc list-inside text-left">
                    {!videoChoice && <li>Choose <strong>Real</strong> or <strong>AI</strong></li>}
                    {videoChoice === "fake" && featureSet.length === 0 && <li>Pick at least one clue</li>}
                    {!reasonOk && <li>Write at least {MIN_REASON_LEN} characters in reasoning</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {submitted && showBadge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white border-4 border-green-500 rounded-2xl p-6 shadow-xl text-center max-w-md"
            >
              <div className="text-3xl mb-2">{getBadge().emoji}</div>
              <div className="font-bold text-xl mb-2">{getBadge().title}</div>
              <div className="text-gray-800">{getBadge().desc}</div>
              <button
                onClick={handleNext}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold"
              >
                Next Case
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
