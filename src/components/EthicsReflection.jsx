import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EthicsReflection({ onExit }) {
  const [step, setStep] = useState("choose");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [reflection, setReflection] = useState("");
  const [completedIds, setCompletedIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [grade, setGrade] = useState("");

  // Enriched UI state for Scenario 1
  const [flags, setFlags] = useState([]);
  const [ethicsChoice, setEthicsChoice] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [actionChoice, setActionChoice] = useState("");
  const [showWhy, setShowWhy] = useState(false);

  const MAX_REASON_LEN = 300;
  const MIN_REASON_LEN = 10;

  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

  const scenarios = [
    {
      id: 1,
      title: "Fake Celebrity Video (Taylor Swift)",
      description:
        "A clip of Taylor Swift talking about a controversial topic is going viral. But this version uses AI: the face or voice has been changed. Watch and decide what’s going on—and whether it’s okay to share.",
      media: { video: "/videos/ethics/Ethics1.mp4" }, 
    },
    {
      id: 2,
      title: "Funny School Video",
      description:
        "You change your voice and look using AI in a school video to make your friends laugh.",
    },
    {
      id: 3,
      title: "Changing a Friend’s Video",
      description:
        "You take a video your friend shared and use AI to make them say something silly. Then you post it without asking them.",
    },
  ];

  useEffect(() => {
    const storedId = localStorage.getItem("deeplearnUserId");
    const storedGrade = localStorage.getItem("deeplearnGrade");

    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }

    if (storedGrade) setGrade(storedGrade);
  }, []);

  useEffect(() => {
    if (step === "reflect") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const resetEnriched = () => {
    setFlags([]);
    setEthicsChoice("");
    setConsentChecked(false);
    setActionChoice("");
    setShowWhy(false);
    setReflection("");
  };

  const handleScenarioSelect = (scenario) => {
    if (completedIds.includes(scenario.id)) return;
    setSelectedScenario(scenario);
    resetEnriched();
    setStep("reflect");
  };

  const toggleFlag = (flag) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const isScenario1 = selectedScenario && selectedScenario.id === 1;

  // Validation
  const scenario1Valid =
    isScenario1 &&
    ethicsChoice &&
    (flags.length > 0 || reflection.trim().length >= MIN_REASON_LEN);

  const otherScenarioValid = !isScenario1 && reflection.trim().length > 0;

  const handleSubmit = async () => {
    if (!selectedScenario) return;

    if (isScenario1 ? !scenario1Valid : !otherScenarioValid) {
      alert(
        isScenario1
          ? "Please choose if it’s okay or not, and either select at least one red flag or write a short reason."
          : "Please write your reflection."
      );
      return;
    }

    const payload = {
      userId,
      grade: grade || "",
      scenarioId: selectedScenario.id,
      scenarioTitle: selectedScenario.title,
      reflectionText: reflection.trim(),
      timestamp: new Date().toISOString(),
    };

    if (isScenario1) {
      payload.ethicsChoice = ethicsChoice;
      payload.flags = flags;
      payload.consentChecked = consentChecked;
      payload.actionChoice = actionChoice;
      payload.media = selectedScenario.media || null;
    }

    try {
      const res = await fetch(`${backend}/api/ethics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to save reflection. Status: ${res.status} - ${errorText}`
        );
      }

      const updated = [...completedIds, selectedScenario.id];
      setCompletedIds(updated);
      setSelectedScenario(null);
      resetEnriched();

      if (updated.length === scenarios.length) {
        setStep("done");
      } else {
        setStep("choose");
      }
    } catch (err) {
      console.error("❌ Ethics reflection submission failed:", err);
      alert("There was a problem saving your reflection.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Think About It</h1>

      {step === "choose" && (
        <>
          <p className="text-blue-800 mb-4">Choose one you haven't done yet:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                role="button"
                tabIndex={0}
                aria-label={`Select scenario: ${scenario.title}`}
                onClick={() => handleScenarioSelect(scenario)}
                onKeyDown={(e) => e.key === "Enter" && handleScenarioSelect(scenario)}
                className={`cursor-pointer border-4 p-4 rounded-xl shadow-md transition ${
                  completedIds.includes(scenario.id)
                    ? "border-gray-300 bg-gray-100 opacity-60 pointer-events-none"
                    : "border-white bg-blue-100 hover:border-orange-400"
                }`}
              >
                <h2 className="font-bold text-lg text-blue-900 mb-2">
                  {scenario.title}
                </h2>
                <p className="text-blue-800">{scenario.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {step === "reflect" && selectedScenario && (
        <div className="bg-white p-6 mt-6 rounded-xl shadow-md w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-2 text-blue-900">
            {selectedScenario.title}
          </h3>
          <p className="text-blue-800 mb-4">{selectedScenario.description}</p>

          {isScenario1 ? (
            <>
              {/* Media block (video) */}
              <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  Watch the clip (possible AI-altered):
                </p>
                <video
                  controls
                  className="w-full rounded"
                  preload="metadata"
                  playsInline
                  aria-label="Video: Possible AI-altered celebrity clip"
                >
                  <source src={selectedScenario.media?.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Quick ethics decision */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  Is posting or sharing this okay?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "ok", label: "Okay" },
                    { v: "not_ok", label: "Not Okay" },
                    { v: "unsure", label: "Not Sure" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setEthicsChoice(opt.v)}
                      className={`px-3 py-2 rounded border transition ${
                        ethicsChoice === opt.v
                          ? "bg-orange-500 text-white border-orange-600"
                          : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Red flag checklist */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  What red flags did you notice? (pick any)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Lip movement doesn’t match",
                    "Skin/lighting looks off",
                    "Voice doesn’t sound natural/typical",
                    "Weird pauses or glitches",
                    "Unverified source or repost",
                    "Unusual claim or tone",
                  ].map((f) => (
                    <label key={f} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={flags.includes(f)}
                        onChange={() => toggleFlag(f)}
                      />
                      <span className="text-gray-800">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent check */}
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                  />
                <span className="text-gray-800">
                    I understand that celebrities (and anyone) deserve{" "}
                    <strong>consent</strong> over how their face/voice is used.
                  </span>
                </label>
              </div>

              {/* Action challenge */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">What would you do?</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "share", label: "Share it" },
                    { v: "report", label: "Report it" },
                    { v: "factcheck", label: "Fact-check first" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setActionChoice(opt.v)}
                      className={`px-3 py-2 rounded border transition ${
                        actionChoice === opt.v
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {actionChoice && (
                  <p className="text-xs text-gray-600 mt-2">
                    {actionChoice === "share" &&
                      "Be careful: sharing could spread misinformation and harm someone’s reputation."}
                    {actionChoice === "report" &&
                      "Good call: reporting helps platforms review potentially harmful content."}
                    {actionChoice === "factcheck" &&
                      "Smart move: check reliable sources before deciding to share or report."}
                  </p>
                )}
              </div>

              {/* Knowledge popover */}
              <div className="mb-4">
                <button
                  onClick={() => setShowWhy((s) => !s)}
                  className="text-sm underline text-blue-700"
                >
                  Why does this matter?
                </button>
                {showWhy && (
                  <div className="mt-2 text-sm bg-blue-50 border border-blue-200 p-3 rounded">
                    AI can blend faces and voices so well that millions might be misled.
                    This can damage reputations, influence opinions, or trick fans. Always
                    look for red flags, check the source, and think about consent.
                  </div>
                )}
              </div>

              {/* Short explanation (optional if flags chosen) */}
              <label className="block text-sm text-gray-700 mb-1">
                (Optional) Explain your thinking in 1–3 sentences
              </label>
              <textarea
                value={reflection}
                onChange={(e) =>
                  e.target.value.length <= MAX_REASON_LEN &&
                  setReflection(e.target.value)
                }
                placeholder="Write what you think here..."
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="text-xs text-gray-500 mt-1">
                {reflection.length}/{MAX_REASON_LEN} characters
                {reflection.length > 0 && reflection.length < MIN_REASON_LEN
                  ? " · try at least 10 chars if you’re not selecting any red flags"
                  : ""}
              </div>
            </>
          ) : (
            <>
              {/* Original simple reflection for other scenarios */}
              <label className="block text-sm text-gray-700 mb-1">
                Do you think this is okay or not okay? Why or why not?
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write what you think here..."
                rows={5}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setStep("choose")}
              className="text-gray-600 underline"
            >
              ← Choose another scenario
            </button>
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-bold rounded"
            >
              Submit Reflection
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
              You've thoughtfully reflected on all 3 real-life AI scenarios.<br />
              You're becoming a mindful AI explorer!
            </p>
            <button
              onClick={() => {
                if (onExit) onExit();
              }}
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
