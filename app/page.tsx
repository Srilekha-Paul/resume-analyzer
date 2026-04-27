"use client";

import { useState } from "react";
import Results from "./components/Results";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Resume Analyzer
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Upload your PDF resume and get AI-powered feedback instantly
        </p>
      </div>

      {/* Upload Zone */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-12 cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
        <span className="text-4xl mb-3">📄</span>
        <span className="font-medium text-gray-700">
          {file ? file.name : "Drop your resume here"}
        </span>
        <span className="text-sm text-gray-400 mt-1">PDF only</span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-gray-700 transition-colors"
      >
        {loading ? "Analyzing…" : "Analyze my resume →"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {result && <Results data={result} />}
    </main>
  );
}