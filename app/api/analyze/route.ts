import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: "application/pdf", data: base64 } },
              {
                text: `Analyze this resume and return ONLY a raw JSON object with no markdown, no backticks, no explanation. Keys required:
- scores: object with keys overall, impact, clarity, ats (each a number 0-100)
- overall: string (2-3 sentence summary)
- strengths: string (bullet points using • character)
- improvements: string (bullet points using • character)
- suggestions: string (numbered actionable tips)
- jobTitles: array of 3 strings (best matching job titles for this resume)`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
          }
        })
      }
    );

    const geminiData = await response.json();

    if (!response.ok) {
      throw new Error(geminiData.error?.message || "Gemini API error");
    }

    // ✅ This is the fixed line
    const text = geminiData.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}