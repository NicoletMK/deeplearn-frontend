import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function WelcomePage({ onStart, onExit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('deeplearnUserId');
    if (stored) {
      setUserId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem('deeplearnUserId', newId);
      setUserId(newId);
    }
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          firstName,
          lastName,
          age,
          grade,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('✅ Submitted to backend');
      onStart(); // Move to next screen
    } catch (error) {
      console.error('❌ Submission failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-6">
      <div className="relative w-full flex justify-between items-center bg-sky-300 p-4 rounded-t-xl">
        <h1 className="text-3xl font-bold text-blue-900">DeepLearn</h1>
        <div className="relative">
          <button onClick={toggleMenu} className="space-y-1 focus:outline-none">
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
            <div className="w-6 h-1 bg-blue-800 rounded"></div>
          </button>
          <div
            className={
              "absolute right-0 mt-2 w-40 bg-white border border-blue-300 rounded-lg shadow-lg z-10 transform transition-all duration-200 origin-top " +
              (showMenu ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")
            }
          >
            <button
              onClick={() => {
                onExit();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              🔙 Exit to Home
            </button>
            <button
              onClick={() => {
                alert('DeepLearn helps you explore deepfake and AI ethics in a fun, interactive way!');
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              ❓ About
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8 text-center">
        <h2 className="text-5xl font-extrabold text-orange-600 mb-4">Welcome to DeepLearn!</h2>
        <p className="text-xl text-blue-900 font-semibold mb-3">
          You’re about to become a <span className="text-purple-700">deepfake detective</span>! 🕵️‍♀️
        </p>
        <div className="text-lg text-gray-800 space-y-2 font-medium">
          <p>🌟 <span className="text-pink-600">Watch fun videos</span> and guess if they’re real or fake.</p>
          <p>🎨 <span className="text-blue-600">Create your own AI videos</span> to learn how deepfakes are made.</p>
          <p>💬 <span className="text-green-600">Think about the impact</span> of AI on what we see online.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 bg-yellow-50 p-6 rounded-lg shadow-md w-full max-w-4xl mt-6">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src="/Welcome.png" alt="Welcome illustration" className="w-full max-w-md h-auto" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="p-3 rounded-md border border-blue-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-500 text-white font-bold py-3 rounded-md transition text-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
            >
              {loading ? "Submitting..." : "🚀 Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
