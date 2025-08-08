import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EthicsReflection({ onExit }) {
  const [step, setStep] = useState("choose");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [reflection, setReflection] = useState("");
  const [completedIds, setCompletedIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [grade, setGrade] = useState("");
  const [flags, setFlags] = useState([]);
  const [ethicsChoice, setEthicsChoice] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [actionChoice, setActionChoice] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [disclosureChoice, setDisclosureChoice] = useState(""); // "yes" | "no" | "unsure"
  const [impactFlags, setImpactFlags] = useState([]);
  const [impactAck, setImpactAck] = useState(false);
  const [showWhy2, setShowWhy2] = useState(false);
  const [humorVsHarm, setHumorVsHarm] = useState(""); // "harmless" | "could_hurt" | "unsure"
  const [friendConsent, setFriendConsent] = useState(false);
  const [misinfoFlags, setMisinfoFlags] = useState([]); // quick red flags
  const [sourceChecked, setSourceChecked] = useState(false);
  const MAX_REASON_LEN = 300;
  const MIN_REASON_LEN = 10;
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

  const scenarios = [
    {
      id: 1,
      title: "Celebrity Deepfake Controversy",
      description:
        "A clip of a celebrity talking about a controversial topic is going viral. But this version uses AI: the face or voice has been changed. Watch and decide what’s going on—and whether it’s okay to share.",
      media: { video: "/videos/ethics/Ethics1.mp4" },
    },
    {
      id: 2,
      title: "AI Model in Brand Ad",
      description:
        "A sleek commercial shows a model wearing designer sunglasses for a famous brand. The model is entirely AI-generated. Watch and think about how this affects honesty in ads, jobs, and audience trust.",
      media: { video: "/videos/ethics/Ethics2.mp4" },
    },
    {
      id: 3,
      title: "Face-Swap Humor Challenge",
      description:
        "A funny clip uses an AI face swap on a human or a historical character for laughs. Reflect on making funny videos with a friend’s or any available face: when is humor okay, and when could it cross a line?",
      media: { video: "/videos/ethics/Ethics3.mp4" }, 
    },
    {
      id: 4,
      title: "Viral Video Misinformation",
      description:
        "A viral video shows a woman walking two giant dogs. It looks wild—could it be edited, staged, or AI-generated? Think about how eye-catching content can still mislead people.",
      media: { video: "/videos/ethics/Ethics4.mp4" }, 
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

  const resetScenario1 = () => {
    setFlags([]);
    setEthicsChoice("");
    setConsentChecked(false);
    setActionChoice("");
    setShowWhy(false);
  };
  const resetScenario2 = () => {
    setDisclosureChoice("");
    setImpactFlags([]);
    setImpactAck(false);
    setShowWhy2(false);
  };
  const resetScenario3 = () => {
    setHumorVsHarm("");
    setFriendConsent(false);
  };
  const resetScenario4 = () => {
    setMisinfoFlags([]);
    setSourceChecked(false);
  };
  const resetCommon = () => {
    setReflection("");
  };
  const resetEnrichedAll = () => {
    resetScenario1();
    resetScenario2();
    resetScenario3();
    resetScenario4();
    resetCommon();
  };

  const handleScenarioSelect = (scenario) => {
    if (completedIds.includes(scenario.id)) return;
    setSelectedScenario(scenario);
    resetEnrichedAll();
    setStep("reflect");
  };

  const toggleFlag = (flag) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };
  const toggleImpactFlag = (flag) => {
    setImpactFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };
  const toggleMisinfoFlag = (flag) => {
    setMisinfoFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const isScenario1 = selectedScenario && selectedScenario.id === 1;
  const isScenario2 = selectedScenario && selectedScenario.id === 2;
  const isScenario3 = selectedScenario && selectedScenario.id === 3;
  const isScenario4 = selectedScenario && selectedScenario.id === 4;

  // VALIDATION: reflection is REQUIRED for ALL scenarios (≥ MIN_REASON_LEN)
  const scenario1Valid =
    isScenario1 && ethicsChoice && reflection.trim().length >= MIN_REASON_LEN;

  const scenario2Valid =
    isScenario2 && disclosureChoice && reflection.trim().length >= MIN_REASON_LEN;

  const scenario3Valid =
    isScenario3 && reflection.trim().length >= MIN_REASON_LEN;

  const scenario4Valid =
    isScenario4 && reflection.trim().length >= MIN_REASON_LEN;

  const handleSubmit = async () => {
    if (!selectedScenario) return;

    const valid =
      (isScenario1 && scenario1Valid) ||
      (isScenario2 && scenario2Valid) ||
      (isScenario3 && scenario3Valid) ||
      (isScenario4 && scenario4Valid) ||
      (!isScenario1 && !isScenario2 && !isScenario3 && !isScenario4 && reflection.trim().length >= MIN_REASON_LEN);

    if (!valid) {
      alert(
        isScenario1
          ? "Pick Okay/Not Okay/Not Sure, and explain your thinking in 1–3 sentences."
          : isScenario2
          ? "Choose if brands should disclose AI models, and explain your thinking in 1–3 sentences."
          : "Please explain your thinking in 1–3 sentences (at least 10 characters)."
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
      Object.assign(payload, {
        ethicsChoice, // "ok" | "not_ok" | "unsure"
        flags,
        consentChecked,
        actionChoice, // "share" | "report" | "factcheck" | ""
        media: selectedScenario.media || null,
      });
    } else if (isScenario2) {
      Object.assign(payload, {
        disclosureChoice, // "yes" | "no" | "unsure"
        impactFlags,
        impactAck,
        media: selectedScenario.media || null,
      });
    } else if (isScenario3) {
      Object.assign(payload, {
        humorVsHarm, // "harmless" | "could_hurt" | "unsure"
        friendConsent, // boolean
        media: selectedScenario.media || null,
      });
    } else if (isScenario4) {
      Object.assign(payload, {
        misinfoFlags,
        sourceChecked,
        media: selectedScenario.media || null,
      });
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
      resetEnrichedAll();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          {/* Media block for scenarios with video */}
          {selectedScenario.media?.video && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                Watch the clip:
              </p>
              <video
                controls
                className="w-full rounded"
                preload="metadata"
                playsInline
                aria-label="Video clip"
              >
                <source src={selectedScenario.media.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Scenario-specific UI */}
          {selectedScenario.id === 1 && (
            <>
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
              </div>

              {/* Why this matters */}
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
            </>
          )}

          {selectedScenario.id === 2 && (
            <>
              {/* Disclosure decision */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  Should brands disclose when a model in the ad is AI-generated?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "yes", label: "Yes" },
                    { v: "no", label: "No" },
                    { v: "unsure", label: "Not Sure" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setDisclosureChoice(opt.v)}
                      className={`px-3 py-2 rounded border transition ${
                        disclosureChoice === opt.v
                          ? "bg-orange-500 text-white border-orange-600"
                          : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact checklist */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  What could be the impact? (pick any)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Might mislead customers about product look/fit",
                    "Could replace jobs for human models/crew",
                    "Unrealistic beauty/body standards",
                    "Lower production costs for brands",
                    "Harder to verify sponsorships/endorsements",
                    "Helps test many creative ideas quickly",
                  ].map((f) => (
                    <label key={f} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={impactFlags.includes(f)}
                        onChange={() => toggleImpactFlag(f)}
                      />
                      <span className="text-gray-800">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Acknowledgement */}
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={impactAck}
                    onChange={(e) => setImpactAck(e.target.checked)}
                  />
                  <span className="text-gray-800">
                    I understand that AI-generated ads can affect{" "}
                    <strong>jobs, honesty,</strong> and <strong>consumer trust</strong>.
                  </span>
                </label>
              </div>

              {/* Why this matters */}
              <div className="mb-4">
                <button
                  onClick={() => setShowWhy2((s) => !s)}
                  className="text-sm underline text-blue-700"
                >
                  Why does disclosure matter?
                </button>
                {showWhy2 && (
                  <div className="mt-2 text-sm bg-blue-50 border border-blue-200 p-3 rounded">
                    Clear labels help people understand what they’re seeing. Without
                    disclosure, viewers might believe the model is real, which can shape
                    what they buy, how they feel about brands, and how they view body
                    standards or endorsements.
                  </div>
                )}
              </div>
            </>
          )}

          {selectedScenario.id === 3 && (
            <>
              {/* Humor vs harm */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  Is this kind of humor harmless or could it hurt someone?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "harmless", label: "Mostly harmless" },
                    { v: "could_hurt", label: "Could hurt someone" },
                    { v: "unsure", label: "Not Sure" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setHumorVsHarm(opt.v)}
                      className={`px-3 py-2 rounded border transition ${
                        humorVsHarm === opt.v
                          ? "bg-orange-500 text-white border-orange-600"
                          : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent reminder */}
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={friendConsent}
                    onChange={(e) => setFriendConsent(e.target.checked)}
                  />
                  <span className="text-gray-800">
                    I understand that using a friend’s (or anyone’s) face needs{" "}
                    <strong>permission</strong>, and jokes can still harm feelings or reputation.
                  </span>
                </label>
              </div>
            </>
          )}

          {selectedScenario.id === 4 && (
            <>
              {/* Misinformation flags */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  What makes this possibly misleading? (pick any)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Unusual scale or proportions",
                    "No credible source/context",
                    "Possible editing/VFX indicators",
                    "Too sensational to be true",
                    "Caption claims more than video shows",
                    "Looping or odd motion artifacts",
                  ].map((f) => (
                    <label key={f} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={misinfoFlags.includes(f)}
                        onChange={() => toggleMisinfoFlag(f)}
                      />
                      <span className="text-gray-800">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Source check */}
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={sourceChecked}
                    onChange={(e) => setSourceChecked(e.target.checked)}
                  />
                  <span className="text-gray-800">
                    I tried to check the <strong>original source</strong> or looked for{" "}
                    <strong>reliable coverage</strong> before believing or sharing.
                  </span>
                </label>
              </div>
            </>
          )}

          {/* REQUIRED reflection box for all scenarios */}
          <label className="block text-sm text-gray-700 mb-1">
            {isScenario1
              ? "Explain your thinking in 1–3 sentences"
              : isScenario2
              ? "Do you think disclosure should be a rule? Why or why not? (1–3 sentences)"
              : isScenario3
              ? "Explain when humor crosses the line and why. (1–3 sentences)"
              : isScenario4
              ? "Explain how you’d verify this and why it matters. (1–3 sentences)"
              : "Do you think this is okay or not okay? Why or why not?"}
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
              ? " · please write at least 10 characters"
              : ""}
          </div>

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
              You've thoughtfully reflected on all 4 real-life AI scenarios.<br />
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
