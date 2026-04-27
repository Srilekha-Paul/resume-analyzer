type Props = {
  data: {
    scores: Record<string, number>;
    overall: string;
    strengths: string;
    improvements: string;
    suggestions: string;
    jobTitles?: string[];
  };
};

const scoreLabels: Record<string, string> = {
  overall: "Overall Score",
  impact: "Impact",
  clarity: "Clarity",
  ats: "ATS Score",
};

export default function Results({ data }: Props) {
  return (
    <div className="mt-10 space-y-4">

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(data.scores).map(([key, val]) => (
          <div key={key} className="rounded-xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-3xl font-bold text-white">{Math.round(val)}</div>
            <div className="text-xs mt-1" style={{ color: "#64748b" }}>{scoreLabels[key] ?? key}</div>
          </div>
        ))}
      </div>

      {/* Job Titles */}
      {data.jobTitles && data.jobTitles.length > 0 && (
        <div className="rounded-xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#64748b" }}>
            Best Matched Job Titles
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.jobTitles.map((title) => (
              <span key={title} className="px-3 py-1 rounded-full text-sm font-medium text-blue-300"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Text Sections */}
      {[
        { label: "Overall Assessment", content: data.overall },
        { label: "Strengths",          content: data.strengths },
        { label: "Areas to Improve",   content: data.improvements },
        { label: "Suggestions",        content: data.suggestions },
      ].map(({ label, content }) => (
        <div key={label} className="rounded-xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#64748b" }}>
            {label}
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#cbd5e1" }}>
            {content}
          </p>
        </div>
      ))}
    </div>
  );
}