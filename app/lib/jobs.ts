export const JOB_LISTINGS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Razorpay",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["react", "javascript", "typescript", "html", "css", "tailwind", "next.js", "rest api", "git"],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Zoho",
    location: "Chennai, India",
    type: "Full-time",
    keywords: ["node.js", "react", "mongodb", "express", "typescript", "rest api", "git", "sql"],
  },
  {
    id: 3,
    title: "React Developer",
    company: "Swiggy",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["react", "javascript", "css", "html", "redux", "tailwind", "git", "jest"],
  },
  {
    id: 4,
    title: "Python Developer",
    company: "Infosys",
    location: "Pune, India",
    type: "Full-time",
    keywords: ["python", "flask", "django", "sql", "rest api", "git", "mongodb", "docker"],
  },
  {
    id: 5,
    title: "Junior Software Engineer",
    company: "Wipro",
    location: "Hyderabad, India",
    type: "Full-time",
    keywords: ["javascript", "python", "sql", "git", "html", "css", "problem solving", "communication"],
  },
  {
    id: 6,
    title: "Next.js Developer",
    company: "Cred",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["next.js", "react", "typescript", "tailwind", "vercel", "rest api", "mongodb", "git"],
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "Meesho",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["node.js", "express", "mongodb", "sql", "rest api", "docker", "git", "python"],
  },
  {
    id: 8,
    title: "Software Developer Trainee",
    company: "TCS",
    location: "Multiple locations",
    type: "Full-time",
    keywords: ["javascript", "python", "sql", "git", "html", "css", "java", "problem solving"],
  },
  {
    id: 9,
    title: "UI Developer",
    company: "Flipkart",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["react", "javascript", "css", "html", "tailwind", "figma", "git", "responsive design"],
  },
  {
    id: 10,
    title: "Data Engineer (Python)",
    company: "PhonePe",
    location: "Bengaluru, India",
    type: "Full-time",
    keywords: ["python", "sql", "mongodb", "numpy", "pandas", "data analysis", "rest api", "git"],
  },
];
 
export function matchJobs(resumeText: string) {
  const lower = resumeText.toLowerCase();
 
  return JOB_LISTINGS.map((job) => {
    const matched = job.keywords.filter((kw) => lower.includes(kw));
    const score = Math.round((matched.length / job.keywords.length) * 100);
    return { ...job, matchScore: score, matchedKeywords: matched };
  })
    .filter((j) => j.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}