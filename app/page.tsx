"use client";
import { useState, useRef } from "react";
// import Results from "@/components/Results";
 import Results from "@/app/components/Results";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
  };
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };
 
  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
 
  if (result) return <Results data={result} onReset={() => { setResult(null); setFile(null); }} />;
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-300 text-sm">AI-Powered by Gemini</span>
        </div>
 
        {/* Heading */}
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Resume Analyzer<br />
          <span className="text-blue-400">&amp; Job Matcher</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Upload your resume. Get an ATS score, AI feedback, and matched job listings — in seconds.
        </p>
 
        {/* Upload box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all mb-6
            ${dragging ? "border-blue-400 bg-blue-500/10" : "border-slate-600 hover:border-blue-500 hover:bg-blue-500/5"}
            ${file ? "border-green-500 bg-green-500/5" : ""}`}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
 
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(1)} KB — click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white font-medium">Drop your resume here</p>
              <p className="text-slate-400 text-sm">PDF files only · Max 5MB</p>
            </div>
          )}
        </div>
 
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}
 
        <button
          onClick={analyze}
          disabled={!file || loading}
          className="w-full py-4 rounded-xl font-semibold text-lg transition-all
            bg-blue-600 hover:bg-blue-500 text-white
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Analyzing your resume...
            </span>
          ) : "Analyze My Resume →"}
        </button>
 
        {/* Features row */}
        <div className="flex items-center justify-center gap-6 mt-8 text-slate-500 text-sm">
          {["ATS Score", "AI Feedback", "Job Matching"].map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
 