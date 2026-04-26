"use client";
 
interface Props {
  data: any;
  onReset: () => void;
}
 
function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 45 ? "#f59e0b" : "#ef4444";
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
 
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">{score}</text>
        <text x="70" y="83" textAnchor="middle" fill="#94a3b8" fontSize="11">/100 ATS Score</text>
      </svg>
    </div>
  );
}
 
export default function Results({ data, onReset }: Props) {
  const { ats, ai, jobs, wordCount } = data;
 
  const verdictColor: Record<string, string> = {
    Strong: "bg-green-500/20 text-green-400 border-green-500/30",
    Average: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Needs Work": "bg-red-500/20 text-red-400 border-red-500/30",
  };
 
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Top bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Resume Analysis</h1>
        <button onClick={onReset} className="text-sm text-slate-400 hover:text-white transition px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500">
          ← Analyze another
        </button>
      </div>
 
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Hero metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ATS Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <ScoreGauge score={ats.score} />
            <span className={`mt-3 text-xs font-medium px-3 py-1 rounded-full border ${verdictColor[ai.verdict] || verdictColor["Average"]}`}>
              {ai.verdict}
            </span>
          </div>
 
          {/* Stats */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-slate-400 text-sm mb-4 font-medium">Overview</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">{ai.summary}</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Word count", value: wordCount },
                { label: "Keywords found", value: ats.matched.length },
                { label: "Jobs matched", value: jobs.length },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-4">✅ Keywords found ({ats.matched.length})</h2>
            <div className="flex flex-wrap gap-2">
              {ats.matched.map((kw: string) => (
                <span key={kw} className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-4">❌ Missing keywords ({ats.missing.length})</h2>
            <div className="flex flex-wrap gap-2">
              {ats.missing.map((kw: string) => (
                <span key={kw} className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
 
        {/* Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">💪 Strengths</h2>
          <ul className="space-y-2">
            {ai.strengths?.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
 
        {/* AI Improvements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">🤖 AI Suggestions to improve</h2>
          <div className="space-y-3">
            {ai.improvements?.map((imp: any, i: number) => (
              <div key={i} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <p className="text-white text-sm font-medium mb-1">{imp.issue}</p>
                <p className="text-slate-400 text-sm">{imp.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
 
        {/* Job Matches */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">💼 Matched job listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.map((job: any) => (
              <div key={job.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500/40 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium text-sm">{job.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{job.company} · {job.location}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0
                    ${job.matchScore >= 70 ? "bg-green-500/20 text-green-400" :
                      job.matchScore >= 45 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-700 text-slate-400"}`}>
                    {job.matchScore}% match
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.matchedKeywords.slice(0, 5).map((kw: string) => (
                    <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}