import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EthicsReflection({ onExit }) {
  const [step, setStep] = useState("choose");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [reflection, setReflection] = useState("");
  const [completedIds, setCompletedIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [grade, setGrade] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

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
    const storedId = localStorage.getItem("deeplearnUserId");
    const storedGrade = localStorage.getItem("deeplearnGrade"); // optional storage

    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }

    if (storedGrade) {
      setGrade(storedGrade);
    } else {
      setGrade(""); // fallback
    }
  }, []);

  useEffect(() => {
    if (step === 'reflect') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

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
      grade: grade || "",
      reflectionText: reflection, // ✅ fixed key name
