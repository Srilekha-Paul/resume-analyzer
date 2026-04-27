"use client";

import { useState } from "react";
import Results from "./components/Results";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

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

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else setError("Please upload a PDF file only.");
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{
        background: "linear-gradient(135deg, #0a0f2e 0%, #0d1b4b 50%, #0a0f2e 100%)",
      }}
    >
      <div className="w-full max-w-2xl">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-blue-300 border border-blue-500/40 bg-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
            AI-Powered by Gemini
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Resume Analyzer
          </h1>
          <h2 className="text-5xl font-bold leading-tight mt-1"
            style={{ color: "#38bdf8" }}>
            &amp; Job Matcher
          </h2>
          <p className="text-gray-400 mt-4 text-base max-w-md mx-auto">
            Upload your resume. Get an ATS score, AI feedback, and matched job listings — in seconds.
          </p>
        </div>

        {/* Upload Zone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center rounded-2xl p-14 cursor-pointer transition-all"
          style={{
            border: dragOver
              ? "2px dashed #38bdf8"
              : file
              ? "2px dashed #22c55e"
              : "2px dashed rgba(148,163,184,0.4)",
            background: dragOver
              ? "rgba(56,189,248,0.05)"
              : file
              ? "rgba(34,197,94,0.05)"
              : "rgba(255,255,255,0.03)",
          }}
        >
          {/* Icon */}
          <div className="mb-4 p-4 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)" }}>
            {file ? (
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#22c55e" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#94a3b8" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>

          <span className="font-semibold text-white text-base">
            {file ? file.name : "Drop your resume here"}
          </span>
          <span className="text-sm mt-1" style={{ color: "#64748b" }}>
            {file
              ? `${(file.size / 1024).toFixed(1)} KB — click to change`
              : "PDF files only · Max 5MB"}
          </span>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setResult(null);
                setError("");
              }
            }}
          />
        </label>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full mt-4 py-4 rounded-xl font-semibold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: loading || !file
              ? "rgba(59,130,246,0.5)"
              : "linear-gradient(90deg, #2563eb, #3b82f6)",
            boxShadow: file && !loading ? "0 0 24px rgba(59,130,246,0.4)" : "none",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing your resume…
            </span>
          ) : (
            "Analyze My Resume →"
          )}
        </button>

        {/* Feature Pills */}
        <div className="flex justify-center gap-6 mt-5">
          {["ATS Score", "AI Feedback", "Job Matching"].map((label) => (
            <span key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              {label}
            </span>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && <Results data={result} />}

      </div>
    </main>
  );
}