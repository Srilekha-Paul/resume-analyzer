const ATS_KEYWORDS = [
  // Frontend
  "react", "next.js", "vue", "angular", "typescript", "javascript", "html", "css",
  "tailwind", "sass", "redux", "webpack", "vite", "responsive design", "figma",
  // Backend
  "node.js", "express", "flask", "django", "fastapi", "rest api", "graphql",
  "python", "java", "go", "php",
  // Database
  "mongodb", "mysql", "postgresql", "sql", "firebase", "redis", "supabase", "drizzle",
  // Tools
  "git", "github", "docker", "kubernetes", "ci/cd", "vercel", "aws", "linux", "postman",
  // Soft / general
  "problem solving", "agile", "communication", "teamwork", "testing", "jest",
  // Data / AI
  "numpy", "pandas", "pytorch", "tensorflow", "machine learning", "data analysis", "streamlit",
];
 
export interface ATSResult {
  score: number;
  matched: string[];
  missing: string[];
  total: number;
}
 
export function scoreResume(text: string): ATSResult {
  const lower = text.toLowerCase();
  const matched = ATS_KEYWORDS.filter((kw) => lower.includes(kw));
  const missing = ATS_KEYWORDS.filter((kw) => !lower.includes(kw)).slice(0, 12);
  const score = Math.min(100, Math.round((matched.length / 20) * 100));
  return { score, matched, missing: missing.slice(0, 8), total: ATS_KEYWORDS.length };
}
 