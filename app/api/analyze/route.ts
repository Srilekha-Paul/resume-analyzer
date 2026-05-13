import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

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

    const response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: "application/pdf", data: base64 } },
              {
                text: `Analyze this resume and return ONLY a raw JSON object with no markdown, no backticks, and no explanation. Keys required:
- scores: object with keys overall, impact, clarity, ats (each a number 0-100)
- overall: string (2-3 sentence summary)
- strengths: string (bullet points using - prefix)
- improvements: string (bullet points using - prefix)
- suggestions: string (numbered actionable tips)
- jobTitles: array of 3 strings (best matching job titles for this resume)`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    });

    const geminiData = await response.json();

    if (!response.ok) {
      throw new Error(geminiData.error?.message || "Gemini API error");
    }

    const text = geminiData.candidates?.[0]?.content?.parts?.find(
      (part: { text?: string }) => typeof part.text === "string"
    )?.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
