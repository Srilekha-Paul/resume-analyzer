type Props = {
  data: {
    scores: Record<string, number>;
    overall: string;
    strengths: string;
    improvements: string;
    suggestions: string;
  };
};

const scoreLabels: Record<string, string> = {
  overall: "Overall Score",
  impact: "Impact",
  clarity: "Clarity",
  ats: "ATS Friendliness",
};

export default function Results({ data }: Props) {
  return (
    <div className="space-y-6 mt-8">
      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(data.scores).map(([key, val]) => (
          <div key={key} className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-semibold text-gray-900">
              {Math.round(val)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {scoreLabels[key] ?? key}
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {[
        { label: "Overall Assessment", content: data.overall },
        { label: "Strengths", content: data.strengths },
        { label: "Areas to Improve", content: data.improvements },
        { label: "Actionable Suggestions", content: data.suggestions },
      ].map(({ label, content }) => (
        <div key={label} className="border rounded-xl p-5">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            {label}
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
      ))}
    </div>
  );
}