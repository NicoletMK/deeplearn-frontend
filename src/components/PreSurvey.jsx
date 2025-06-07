import React, { useState, useEffect } from "react";
import axios from '../utils/axiosInstance';
import { v4 as uuidv4 } from "uuid";

export default function PreSurvey({ onSubmit }) {
  const [userId, setUserId] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

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

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { userId, ...answers };
    try {
      console.log("Submitting pre-survey:", payload);
      await axios.post('https://deeplearn-backend.onrender.com/api/pre-survey', payload);
      if (onSubmit) {
        onSubmit();  // Trigger next step (e.g., routing to Creator or Detective mode)
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex justify-center p-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">📝 Pre-Survey: Before You Explore DeepLearn</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              1. Have you ever seen a video or picture that looked real but wasn’t?
            </label>
            <div className="space-y-1" onChange={handleChange}>
              <label><input type="radio" name="q1" value="Yes" required /> Yes</label><br />
              <label><input type="radio" name="q1" value="No" /> No</label><br />
              <label><input type="radio" name="q1" value="Not sure" /> Not sure</label>
            </div>
          </div>

          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              2. Do you know about “deepfake”?
            </label>
            <div className="space-y-1" onChange={handleChange}>
              <label><input type="radio" name="q2" value="Yes" required /> Yes</label><br />
              <label><input type="radio" name="q2" value="No" /> No</label><br />
              <label><input type="radio" name="q2" value="Not sure" /> Not sure</label>
            </div>
          </div>

          <div className="pl-4 md:pl-6">
            <label className="block font-medium text-lg mb-2">
              3. If a person is talking in a video, do you think it’s always real?
            </label>
            <div className="space-y-1" onChange={handleChange}>
              <label><input type="radio" name="q3" value="Yes" required /> Yes</label><br />
              <label><input type="radio" name="q3" value="No" /> No</label><br />
              <label><input type="radio" name="q3" value="Sometimes" /> Sometimes</label>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              Start DeepLearn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
