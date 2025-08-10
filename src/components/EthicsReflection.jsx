import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EthicsReflection({ onExit }) {
  const [step, setStep] = useState("choose");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [grade, setGrade] = useState("");
  const [reflection, setReflection] = useState("");

  // Impact selections + free-text "Other impact"
  const [impactSelections, setImpactSelections] = useState([]); // strings
  const [otherImpact, setOtherImpact] = useState("");           // single free-text

  // Think-deeper single-choice + "Other idea"
  const [thinkChoice, setThinkChoice] = useState("");
  const [thinkOther, setThinkOther] = useState("");

  // Gamification
  const [badge, setBadge] = useState(null); // {title, emoji, desc}
  const [showBadge, setShowBadge] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
  const MIN_REASON_LEN = 10;

  // Pull app-level IDs created on the welcome page
  useEffect(() => {
    const storedId = localStorage.getItem("deeplearnUserId");
    const storedGrade = localStorage.getItem("deeplearnGrade");
    if (storedId) setUserId(storedId);
    else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }
    if (storedGrade) setGrade(storedGrade);
  }, []);

  useEffect(() => {
    if (step === "reflect") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const scenarios = useMemo(
    () => [
      {
        id: 1,
        title: "Famous Face, Unspoken Words",
        description:
          "A well-known figure appears to say something they never said. The clip isn’t harmful on the surface, but it could still affect how people trust real interviews and public communication.",
        media: { video: "/videos/ethics/Ethics1.mp4" },
        impacts: [
          "Might make fans believe the words are real",
          "Uses someone’s likeness without consent",
          "Could change how people view this person",
          "Makes it harder to trust real interviews",
          "Encourages more celebrity deepfakes",
          "Spreads quickly without context"
        ],
        thinkPrompt: "How should harmless celebrity deepfakes be handled?",
        thinkOptions: [
          "Label all AI-altered celebrity videos",
          "Label only when there’s clear harm",
          "No label needed if it’s just for fun"
        ],
        reflectionPrompt:
          "Why can a ‘harmless’ deepfake still matter for consent or public trust? (1–3 sentences)"
      },
      {
        id: 2,
        title: "The AI Supermodel in Your Feed",
        description:
          "A commercial features a model showing off sunglasses for a popular brand — but the model is fully AI-generated and the ad doesn’t say so.",
        media: { video: "/videos/ethics/Ethics2.mp4" },
        impacts: [
          "Might mislead customers about product look/fit",
          "Could replace jobs for human models and crew",
          "Promotes unrealistic beauty/body standards",
          "Lowers production costs for brands",
          "Harder to verify endorsements or sponsorships",
          "Helps test many creative ideas quickly"
        ],
        thinkPrompt: "Should ads have to disclose AI-generated models?",
        thinkOptions: [
          "Always disclose in a clear label",
          "Disclose only if it changes reality (fit/look)",
          "Optional — brand’s choice"
        ],
        reflectionPrompt:
          "Should brands use AI-generated models? Why? (1–3 sentences)"
      },
      {
        id: 3,
        title: "The Face Swap Everyone’s Sharing",
        description:
          "Many different faces — celebrities, strangers, and friends — are swapped into the same funny clip without asking permission.",
        media: { video: "/videos/ethics/Ethics4.mp4" },
        impacts: [
          "Uses people’s faces without permission",
          "Can embarrass or upset people involved",
          "Blurs the line between public and private figures",
          "Normalizes face-swapping anyone",
          "Spreads as a meme without context",
          "Funny for some, but crosses boundaries for others"
        ],
        thinkPrompt: "Where should we draw the line for face-swap humor?",
        thinkOptions: [
          "Celebrities are okay; strangers/friends need consent",
          "Ask consent for anyone’s face, famous or not",
          "Humor is enough justification if no harm is intended"
        ],
        reflectionPrompt:
          "When does face-swap humor cross the line, and why? (1–3 sentences)"
      },
      {
        id: 4,
        title: "Money Advice That Isn’t Real",
        description:
          "A realistic ‘news’ clip promotes a can’t-miss investment using fake facts to lure viewers into spending money.",
        media: { video: "/videos/ethics/Ethics3.mp4" },
        impacts: [
          "Could cause real financial harm to viewers",
          "Erodes trust in legitimate news sources",
          "Targets vulnerable or uninformed people",
          "Spreads quickly through social media",
          "Hurts reputations of real companies/people",
          "Blurs real vs. fake financial information"
        ],
        thinkPrompt: "What’s the right response to harmful fake finance videos?",
        thinkOptions: [
          "Platforms should remove and penalize creators",
          "Strong labels and sharing friction are enough",
          "Let audiences decide — free speech first"
        ],
        reflectionPrompt:
          "What responsibilities do creators and platforms have when fake money tips can hurt people? (1–3 sentences)"
      }
    ],
    []
  );

  // Progress helpers
  const total = scenarios.length;
  const completedCount = completedIds.length;
  const unlockedScenarioId = useMemo(() => {
    // first scenario whose id is not in completedIds
    const next = scenarios.find(s => !completedIds.includes(s.id));
    return next ? next.id : null;
  }, [completedIds, scenarios]);

  const progressPercent = Math.round((completedCount / total) * 100);

  // Badges per scenario
  const getBadge = (scenarioId) => {
    switch (scenarioId) {
      case 1: return { title: "Trust Builder", emoji: "🛡️", desc: "You thought about consent and public trust." };
      case 2: return { title: "Transparency Champ", emoji: "🪪", desc: "You weighed honesty in advertising." };
      case 3: return { title: "Kindness Keeper", emoji: "💛", desc: "You balanced humor with respect and consent." };
      case 4: return { title: "Misinformation Defender", emoji: "🚫", desc: "You protected people from harmful fakes." };
      default: return { title: "Ethics Explorer", emoji: "✨", desc: "Great reflection!" };
    }
  };

  const resetScenarioState = () => {
    setImpactSelections([]);
    setOtherImpact("");
    setThinkChoice("");
    setThinkOther("");
    setReflection("");
  };

  const handleOpenUnlocked = () => {
    if (unlockedScenarioId == null) return;
    const next = scenarios.find(s => s.id === unlockedScenarioId);
    if (!next) return;
    setSelectedScenario(next);
    resetScenarioState();
    setStep("reflect");
  };

  const handleScenarioSelect = (scenario) => {
    // Only allow clicking the currently unlocked scenario
    if (scenario.id !== unlockedScenarioId) return;
    setSelectedScenario(scenario);
    resetScenarioState();
    setStep("reflect");
  };

  const toggleImpact = (txt) => {
    setImpactSelections((prev) =>
      prev.includes(txt) ? prev.filter((t) => t !== txt) : [...prev, txt]
    );
  };

  const valid = useMemo(() => {
    if (!selectedScenario) return false;
    const textOK = reflection.trim().length >= MIN_REASON_LEN;
    const impactsOK =
      impactSelections.length >= 1 || otherImpact.trim().length > 0;
    const choiceOK = !!thinkChoice || thinkOther.trim().length > 0;
    return textOK && impactsOK && choiceOK;
  }, [selectedScenario, reflection, impactSelections, otherImpact, thinkChoice, thinkOther]);

  const handleSubmit = async () => {
    if (!selectedScenario) return;
    if (!valid) {
      alert("Please select impacts (≥1 or write your own), choose or write a response, and write 1–3 sentences (≥10 chars).");
      return;
    }

    const mergedImpacts =
      otherImpact.trim().length > 0
        ? [...impactSelections, `Other: ${otherImpact.trim()}`]
        : impactSelections;

    // If no preset choice but "Other idea" provided, store thinkChoice as Other: ...
    const finalThinkChoice =
      thinkChoice || (thinkOther.trim().length > 0 ? `Other: ${thinkOther.trim()}` : "");

    const payload = {
      userId,
      grade: grade || "",
      scenarioId: selectedScenario.id,
      scenarioTitle: selectedScenario.title,
      impacts: mergedImpacts,
      thinkChoice: finalThinkChoice,
      thinkOther: thinkOther.trim(), // raw for analysis
      reflectionText: reflection.trim(),
      timestamp: new Date().toISOString(),
      media: selectedScenario.media || null
    };

    try {
      const res = await fetch(`${backend}/api/ethics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save reflection. Status: ${res.status} - ${errorText}`);
      }

      // mark complete
      const updated = [...completedIds, selectedScenario.id];
      setCompletedIds(updated);

      // badge popup
      const earned = getBadge(selectedScenario.id);
      setBadge(earned);
      setShowBadge(true);

      // reset scenario state but keep us on "reflect" view until user closes badge
      resetScenarioState();
      setSelectedScenario(null);
      // After badge close, we will open the next unlocked scenario (if any)
    } catch (err) {
      console.error("❌ Ethics reflection submission failed:", err);
      alert("There was a problem saving your reflection.");
    }
  };

  // After badge modal "Continue", open next unlocked or finish
  const handleBadgeContinue = () => {
    setShowBadge(false);
    if (completedIds.length === total) {
      setStep("done");
    } else {
      setStep("choose");
      handleOpenUnlocked();
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-8">
      {/* Progress header */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-blue-900">Think About It</h1>
          <span className="text-sm text-blue-900 font-semibold">{completedCount}/{total} done</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-orange-500"
            style={{ width: `${progressPercent}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            role="progressbar"
          />
        </div>

        {/* Step dots */}
const scenarioEmojis = {
  1: "🎭", // Famous Face
  2: "🕶️", // AI Supermodel
  3: "😂", // Face Swap
  4: "💰"  // Fake Finance
};

// Progress dots / emoji tracker
<div className="flex justify-center mb-4">
  {scenarios.map((s) => (
    <span
      key={s.id}
      className={`mx-1 text-2xl ${
        completedIds.includes(s.id) ? "opacity-50" : ""
      }`}
    >
      {scenarioEmojis[s.id]}
    </span>
  ))}
</div>


      {/* Choose view: sequential unlock with locks */}
      {step === "choose" && (
        <>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {scenarios.map((s) => {
              const isDone = completedIds.includes(s.id);
              const isUnlocked = s.id === unlockedScenarioId;
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Scenario ${s.id}: ${s.title}`}
                  onClick={() => handleScenarioSelect(s)}
                  onKeyDown={(e) => e.key === "Enter" && handleScenarioSelect(s)}
                  className={`border-4 p-4 rounded-xl shadow-md transition relative
                    ${isDone ? "border-green-300 bg-green-50 opacity-80" :
                      isUnlocked ? "border-white bg-blue-100 hover:border-orange-400 cursor-pointer" :
                      "border-gray-300 bg-gray-100 opacity-60 pointer-events-none"}`}
                >
                  {!isUnlocked && !isDone && (
                    <div className="absolute top-2 right-2 text-gray-500" aria-hidden>🔒</div>
                  )}
                  {isDone && (
                    <div className="absolute top-2 right-2" aria-hidden>🏅</div>
                  )}
                  <h2 className="font-bold text-lg text-blue-900 mb-2">{s.title}</h2>
                  <p className="text-blue-800 text-sm">{s.description}</p>
                  {isUnlocked && (
                    <div className="mt-3 text-xs text-orange-700 font-semibold">Unlocked — click to begin →</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Helpful CTA to start the next unlocked one */}
          <div className="mt-6">
            <button
              onClick={handleOpenUnlocked}
              disabled={!unlockedScenarioId}
              className={`px-5 py-2 rounded font-bold text-white ${unlockedScenarioId ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
            >
              Start Next Scenario
            </button>
          </div>
        </>
      )}

      {/* Reflect view */}
      {step === "reflect" && selectedScenario && (
        <div className="bg-white p-6 mt-2 rounded-xl shadow-md w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-2 text-blue-900">
            {selectedScenario.title}
          </h3>
          <p className="text-blue-800 mb-4">{selectedScenario.description}</p>

          {/* Video */}
          {selectedScenario.media?.video && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">Watch the clip:</p>
              <video
                controls
                className="w-full rounded"
                preload="metadata"
                playsInline
                aria-label="Ethics scenario video"
              >
                <source src={selectedScenario.media.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* 1) Impact checklist */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">What could be the impact? (pick any)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedScenario.impacts.map((txt) => (
                <label key={txt} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={impactSelections.includes(txt)}
                    onChange={() => toggleImpact(txt)}
                  />
                  <span className="text-gray-800">{txt}</span>
                </label>
              ))}
            </div>

            {/* Other impact (optional, counts as one) */}
            <div className="mt-4 w-full">
              <input
                type="text"
                value={otherImpact}
                onChange={(e) => setOtherImpact(e.target.value)}
                placeholder="Other impact you can think of (optional)"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {impactSelections.length === 0 && otherImpact.trim().length === 0 && (
              <p className="text-xs text-red-600 mt-1">
                Select at least one impact or write your own.
              </p>
            )}
          </div>

          {/* 2) Short reflection (required) */}
          <label className="block text-sm text-gray-700 mb-1">
            {selectedScenario.reflectionPrompt}
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write what you think here (1–3 sentences)..."
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="text-xs text-gray-500 mt-1">
            {reflection.trim().length}/{MIN_REASON_LEN} min chars
            {reflection.trim().length > 0 && reflection.trim().length < MIN_REASON_LEN
              ? " · please write at least 10 characters"
              : ""}
          </div>

          {/* 3) Think deeper (single choice + other idea) */}
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-1">{selectedScenario.thinkPrompt}</p>
            <div className="flex flex-wrap gap-2">
              {selectedScenario.thinkOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setThinkChoice(opt)}
                  className={`px-3 py-2 rounded border transition ${
                    thinkChoice === opt
                      ? "bg-orange-500 text-white border-orange-600"
                      : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Other idea (optional, counts as one) */}
            <div className="mt-3 w-full">
              <input
                type="text"
                value={thinkOther}
                onChange={(e) => setThinkOther(e.target.value)}
                placeholder="Other idea for how to handle this (optional)"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {!thinkChoice && thinkOther.trim().length === 0 && (
              <p className="text-xs text-red-600 mt-1">Choose one option or write your own idea.</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep("choose")} className="text-gray-600 underline">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 font-bold rounded text-white ${
                valid ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Reflection
            </button>
          </div>
        </div>
      )}

      {/* Badge modal after submit */}
      {showBadge && badge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-yellow-200 p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-3">{badge.emoji}</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{badge.title}</h2>
            <p className="text-gray-800 mb-6">{badge.desc}</p>
            <button
              onClick={handleBadgeContinue}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-green-100 border-4 border-green-300 rounded-2xl p-8 max-w-lg w-full text-center shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-800 mb-3">Great job!</h2>
            <p className="text-lg text-gray-800 mb-6">
              You've thoughtfully reflected on all {total} AI scenarios.<br />
              You're becoming a mindful AI explorer!
            </p>
            <button
              onClick={() => onExit && onExit()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg transition"
            >
              ✅ Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
