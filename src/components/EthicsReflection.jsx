import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";

export default function EthicsReflection({ onExit }) {
  const [step, setStep] = useState("choose");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [reflection, setReflection] = useState("");
  const [completedIds, setCompletedIds] = useState([]);
  const [userId, setUserId] = useState("");

  const scenarios = [
    {
      id: 1,
      title: "Fake Celebrity Video",
      description:
        "You use an app to make a video of a celebrity saying something they never said, and you post it online for fun.",
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
    const stored = localStorage.getItem("deeplearnUserId");
    if (stored) {
      setUserId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }
  }, []);

  const handleScenarioSelect = (scenario) => {
    if (completedIds.includes(scenario.id)) return;
    setSelectedScenario(scenario);
    setReflection("");
    setStep("reflect");
  };

  const handleSubmit = async () => {
    if (!selectedScenario || !reflection.trim()) {
      alert("Please write your reflection.");
      return;
    }

    const payload = {
      userId,
      scenarioId: selectedScenario.id,
      scenarioTitle: selectedScenario.title,
      scenarioText: selectedScenario.description,
      reflection,
    };

    try {
      await axios.post("/api/ethics", payload);
      setCompletedIds([...completedIds, selectedScenario.id]);
      setSelectedScenario(null);
      setReflection("");

      if (completedIds.length + 1 === scenarios.length) {
        setStep("done");
      } else {
        setStep("choose");
      }
    } catch (err) {
      console.error("Submission failed:", err);
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
                onClick={() => handleScenarioSelect(scenario)}
                className={`cursor-pointer border-4 p-4 rounded-xl shadow-md transition ${
                  completedIds.includes(scenario.id)
                    ? "border-gray-300 bg-gray-100 opacity-60 pointer-events-none"
                    : "border-white bg-blue-100 hover:border-orange-400"
                }`}
              >
                <h2 className="font-bold text-lg text-blue-900 mb-2">{scenario.title}</h2>
                <p className="text-blue-800">{scenario.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {step === "reflect" && selectedScenario && (
        <div className="bg-white p-6 mt-6 rounded-xl shadow-md w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-2 text-blue-900">{selectedScenario.title}</h3>
          <p className="text-blue-800 mb-4">{selectedScenario.description}</p>
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
          <div className="mt-4 text-center">
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
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-green-100 px-6 pt-20 z-50">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-5xl font-bold text-green-800 mb-4">Great job!</h2>
          <p className="text-2xl text-gray-800 mb-8 max-w-3xl text-center leading-relaxed">
            You've thoughtfully reflected on all 3 real-life AI scenarios.
            <br />
            You're becoming a mindful AI explorer!
          </p>
          <button
            onClick={() => {
              if (onExit) onExit();
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition"
          >
            ✅ Finish
          </button>
        </div>
      )}
    </div>
  );
}