import React, { useState } from 'react';
import axios from 'axios';

const characters = [
  { name: 'Booker', file: 'Booker.png' },
  { name: 'Nia', file: 'Nia.png' },
  { name: 'Raven', file: 'Raven.png' }
];

const videos = [
  { label: 'Booker Video', file: 'Booker0.mp4' },
  { label: 'Nia Video', file: 'Nia1.mp4' },
  { label: 'Raven Video', file: 'Raven2.mp4' }
];

export default function CreatorMode({ onComplete }) {
  const [imageFile, setImageFile] = useState(characters[0].file);
  const [videoFile, setVideoFile] = useState(videos[0].file);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

  const handleSubmit = async () => {
    if (!imageFile || !videoFile) return;

    setLoading(true);
    setProgress(10);
    setPreview(null);

    try {
      // Convert image from public folder into a File
      const formData = new FormData();
      formData.append('imageFileName', imageFile);
      formData.append('sourceVideo', videoFile);


      const response = await axios.post(`${backend}/create-deepfake`, formData, {
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
      console.error('Deepfake creation failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-4 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center">🎭 Creator Mode: Select Characters</h1>

      <div className="mb-4 w-full max-w-md">
        <label className="block font-semibold mb-2">Choose a Face Image:</label>
        <select
          value={imageFile}
          onChange={(e) => setImageFile(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          {characters.map((char, i) => (
            <option key={i} value={char.file}>{char.name}</option>
          ))}
        </select>
        <img
          src={`/characters/${imageFile}`}
          alt="Preview"
          className="mt-3 w-48 h-48 object-cover rounded shadow"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label className="block font-semibold mb-2">Choose a Source Video:</label>
        <select
          value={videoFile}
          onChange={(e) => setVideoFile(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          {videos.map((v, i) => (
            <option key={i} value={v.file}>{v.label}</option>
          ))}
        </select>
        <video
          src={`/videos/creator/${videoFile}`}
          controls
          className="mt-3 w-full max-w-md rounded shadow"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Deepfake...' : 'Generate Face Swap'}
      </button>

      {loading && (
        <div className="mt-4 w-full max-w-md">
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-2">Processing... {progress}%</p>
        </div>
      )}

      {preview && (
        <div className="mt-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Deepfake Video:</h2>
          <video src={preview} controls className="rounded-xl shadow w-full" />
        </div>
      )}
    </div>
  );
}
