import React, { useState, useEffect } from "react";
import axios from '../utils/axiosInstance';
import { v4 as uuidv4 } from "uuid";

export default function PostSurvey({ onSubmit }) {
  const [userId, setUserId] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("deeplearnUserId");
    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("deeplearnUserId", newId);
      setUserId(newId);
    }
  }, []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setQ3((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId,
      q1,
      q2,
      q3
    };
    try {
      await axios.post("/api/post-survey", payload);
      setSubmitted(true);
    } catch (err) {
      console.error("Post-survey submission failed:", err);
    }
  };

  const handleExit = () => {
    localStorage.removeItem("deeplearnUserId");
    if (onSubmit) onSubmit();  // Triggers setView('home') in MainMenu
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          🎉 Thank you for completing the survey!
        </h2>
        <p className="text-blue-800 mb-6 text-center max-w-md">
          You've finished all the activities in DeepLearn. Now it's time for someone else to give it a try!
        </p>
        <button
          onClick={handleExit}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded shadow-md"
        >
          🎉 All done! Let the next kid try
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex justify-center p-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">
          📝 Post-Survey: After You Try DeepLearn
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              1. What is a “deepfake”?
            </label>
            <textarea
              className="w-full p-2 border rounded"
              name="q1"
              rows="3"
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="Type your answer here..."
              required
            ></textarea>
          </div>

          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              2. How are deepfakes made?
            </label>
            <div className="space-y-1" onChange={(e) => setQ2(e.target.value)}>
              <label>
                <input type="radio" name="q2" value="People draw each part" required /> People draw each part
              </label><br />
              <label>
                <input type="radio" name="q2" value="Computers mix up faces and voices using AI" /> Computers mix up faces and voices using AI
              </label><br />
              <label>
                <input type="radio" name="q2" value="The internet makes them" /> The internet makes them
              </label><br />
              <label>
                <input type="radio" name="q2" value="I’m not sure" /> I’m not sure
              </label>
            </div>
          </div>

          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              3. How can you tell if a video might be fake?
            </label>
            <div className="space-y-1">
              <label>
                <input type="checkbox" value="The mouth looks strange" onChange={handleCheckboxChange} /> The mouth looks strange
              </label><br />
              <label>
                <input type="checkbox" value="The sound doesn’t match" onChange={handleCheckboxChange} /> The sound doesn’t match
              </label><br />
              <label>
                <input type="checkbox" value="It just feels weird" onChange={handleCheckboxChange} /> It just feels weird
              </label><br />
              <label>
                <input type="checkbox" value="All of the above" onChange={handleCheckboxChange} /> All of the above
              </label><br />
              <label>
                <input type="checkbox" value="I don’t know" onChange={handleCheckboxChange} /> I don’t know
              </label>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Submit Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
