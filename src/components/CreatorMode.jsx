import React from "react";

export default function CreatorMode() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-8">
      <img src="/Reflection.png" alt="Creator Icon" className="w-56 h-56 mb-4" />
      <h1 className="text-4xl font-bold text-purple-700 mb-4">Creator Mode</h1>
      <p className="text-lg text-blue-900 mb-6 text-center max-w-2xl">
        This is a sample deepfake video created using AI! Watch and explore how AI-generated content can look real.
      </p>

      <div className="w-full max-w-2xl aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/WzK1MBEpkJ0"
          title="YouTube deepfake demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
