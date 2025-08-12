import React, { useEffect, useRef } from "react";
import { Database } from "lucide-react";

export default function IntroCreditsPage({ onContinue, onBack }) {
  const headingRef = useRef(null);

  useEffect(() => {
    // Focus the heading for screen readers when this page mounts
    headingRef.current?.focus();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-orange-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Progress chip */}
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            Step 1 of 5
          </span>
        </div>

        {/* Intro header */}
        <div className="w-full text-center mb-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl font-extrabold text-orange-600 mb-4 focus:outline-none"
          >
            Before You Dive In 🧭
          </h2>
          <p className="text-lg md:text-xl text-blue-900 font-semibold mb-3">
            Welcome to <span className="text-purple-700">DeepLearn</span> — a playful way to study deepfakes responsibly.
          </p>
          <div className="text-base md:text-lg text-gray-800 space-y-2 font-medium">
            <p>🌟 <span className="text-pink-600">Watch fun videos</span> and decide if they’re real or fake.</p>
            <p>🎨 <span className="text-blue-600">Explore how AI videos are made</span> to learn creator tricks.</p>
            <p>💬 <span className="text-green-600">Reflect on impact</span> — who’s affected and what’s fair?</p>
          </div>
        </div>

        {/* Dataset Credits */}
        <section className="rounded-2xl shadow-lg bg-white border border-orange-100 p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <Database className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-900">Dataset Credits</h3>
          </div>
          <p className="text-gray-800">
            DeepLearn’s <span className="font-semibold">Detective</span> and <span className="font-semibold">Reflection</span> activities use a curated, kid-safe subset of
            <span className="font-semibold"> Deepfake-Eval-2024</span> (Chandra et&nbsp;al., 2025).
          </p>
          <ul className="mt-4 grid md:grid-cols-2 gap-2 text-gray-700">
            <li>• ~45h video, 56.5h audio, 1,975 images</li>
            <li>• From 88 websites in 52 languages (2024 media)</li>
            <li>• For benchmarking & social science research</li>
            <li>• License: <span className="font-semibold">CC BY-SA 4.0</span></li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="text-sm font-semibold text-orange-700 underline"
              href="https://arxiv.org/abs/2503.02857"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paper (arXiv)
            </a>
            <a
              className="text-sm font-semibold text-orange-700 underline"
              href="https://doi.org/10.48550/arXiv.2503.02857"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOI
            </a>
            <a
              className="text-sm font-semibold text-orange-700 underline"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA 4.0
            </a>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">Citation (BibTeX)</summary>
            <pre className="mt-2 bg-gray-50 rounded-xl p-3 text-sm overflow-x-auto border border-gray-200">{`@misc{chandra2025deepfakeeval2024multimodalinthewildbenchmark,
  title={Deepfake-Eval-2024: A Multi-Modal In-the-Wild Benchmark of Deepfakes Circulated in 2024},
  author={Nuria Alina Chandra and Ryan Murtfeldt and Lin Qiu and Arnab Karmakar and Hannah Lee and Emmanuel Tanumihardja and Kevin Farhat and Ben Caffee and Sejin Paik and Changyeon Lee and Jongwook Choi and Aerin Kim and Oren Etzioni},
  year={2025},
  eprint={2503.02857},
  archivePrefix={arXiv},
  primaryClass={cs.CV},
  url={https://arxiv.org/abs/2503.02857}
}`}</pre>
          </details>
        </section>

        {/* Responsible Use */}
        <section className="rounded-2xl shadow-lg bg-white border border-green-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Responsible Use</h3>
          <ul className="text-gray-800 space-y-2">
            <li>• <span className="font-semibold">Direct use only:</span> evaluation & reflection.</li>
            <li>• <span className="font-semibold">Out-of-scope:</span> no training of generative models.</li>
            <li>• <span className="font-semibold">Kid-safe subset:</span> NSFW filtered for classrooms.</li>
            <li>• <span className="font-semibold">Attribution:</span> CC BY-SA 4.0 share-alike with credit.</li>
          </ul>
        </section>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-50"
          >
            Back
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="px-5 py-3 rounded-2xl shadow-md bg-orange-500 hover:bg-orange-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Continue
            </button>
            <button
              onClick={onContinue}
              className="text-sm text-gray-600 hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
