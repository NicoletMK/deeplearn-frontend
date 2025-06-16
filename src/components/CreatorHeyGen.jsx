import React, { useState } from 'react';
import axios from 'axios';

const sourceVideos = [
  { label: "AI Host: Welcome Video", file: "heygen_intro.mp4" },
  { label: "AI Host: Education Talk", file: "heygen_edu.mp4" },
  { label: "AI Host: Interview Clip", file: "heygen_interview.mp4" }
];

export default function CreatorHeyGen({ onComplete }) {
  const [image, setImage] = useState(null);
  const [sourceVideo, setSourceVideo] = useState(sourceVideos[0].file);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSubmit = async () => {
    if (!image || !sourceVideo) return;
    setLoading(true);
    setPreview(null);
    setProgress(10);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('sourceVideo', sourceVideo);

    try {
      const response = await axios.post(`${backend}/create-avatar-video`, formData, {
        responseType: 'blob',
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const videoURL = URL.createObjectURL(response.data);
      setProgress(100);
      setPreview(videoURL);
    } catch (err) {
      console.error('HeyGen-style video creation failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">🧑‍🎓 Creator Mode: AI Avatar Video</h1>

      <div className="mb-4 w-full max-w-md">
        <label className="block font-semibold mb-2 text-gray-800">Upload Your Face Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded bg-white"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label className="block font-semibold mb-2 text-gray-800">Choose an AI Host Video:</label>
        <select
          value={sourceVideo}
          onChange={(e) => setSourceVideo(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          {sourceVideos.map((v, i) => (
            <option key={i} value={v.file}>{v.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl text-lg shadow hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Creating Avatar Video...' : 'Generate AI Host'}
      </button>

      {loading && (
        <div className="mt-4 w-full max-w-md">
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-purple-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-2 text-gray-700">Processing... {progress}%</p>
        </div>
      )}

      {preview && (
        <div className="mt-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2 text-purple-800">Your AI Avatar Video:</h2>
          <video src={preview} controls className="rounded-xl shadow w-full" />
        </div>
      )}
    </div>
  );
}
