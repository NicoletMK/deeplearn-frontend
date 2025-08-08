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
        "A clip of Taylor Swift talking about a controversial topic is going viral. But this version uses AI: the face or voice has been changed. Listen and decide what’s going on—and whether it’s okay to share.",
      media: { video: "ethics/Ethics1.mp4" }, 
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
              {/* Media block */}
              <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  Listen to the clip (AI-altered):
                </p>
                <audio
                  controls
                  className="w-full"
                  aria-label="Audio: Possible AI-altered celebrity clip"
                >
                  <source
                    src={selectedScenario.media?.audio}
