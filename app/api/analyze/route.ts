import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { scoreResume } from "@/app/lib/ats"; // Temporary fix for edge runtime module resolution
import { matchJobs } from "@/app/lib/jobs";
 
export const runtime = "nodejs";
export const maxDuration = 30;
 
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
 
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
 
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
    }
 
    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
 
    // Dynamic import to avoid edge runtime issues
    // const pdfParse = (await import("pdf-parse")).default;
    // const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;
 
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please ensure it is not a scanned image." },
        { status: 400 }
      );
    }
 
    // ATS scoring
    const atsResult = scoreResume(resumeText);
 
    // Job matching
    const matchedJobs = matchJobs(resumeText);
 
    // Gemini AI analysis
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
 
    const prompt = `You are an expert ATS resume reviewer and career coach. Analyze the following resume and return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON.
 
Resume text:
"""
${resumeText.slice(0, 3000)}
"""
 
Return this exact JSON structure:
{
  "summary": "2-3 sentence overall assessment of the resume",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": [
    {"issue": "short issue title", "suggestion": "specific actionable fix"},
    {"issue": "short issue title", "suggestion": "specific actionable fix"},
    {"issue": "short issue title", "suggestion": "specific actionable fix"},
    {"issue": "short issue title", "suggestion": "specific actionable fix"}
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "verdict": "Strong" | "Average" | "Needs Work"
}`;
 
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
 
    // Strip markdown code blocks if Gemini wraps response
    const cleaned = rawText.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/```$/, "").trim();
    const aiAnalysis = JSON.parse(cleaned);
 
    return NextResponse.json({
      success: true,
      ats: atsResult,
      ai: aiAnalysis,
      jobs: matchedJobs,
      wordCount: resumeText.split(/\s+/).length,
    });
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}