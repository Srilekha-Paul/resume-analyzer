import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function extractJson(text: string) {
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Could not extract JSON from Gemini response");
  }
  return JSON.parse(match[0]);
}

export async function POST(req: NextRequest) {
  try {
    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Gemini API key is missing. Please set GEMINI_API_KEY in your .env.local file or enter your API key in the UI settings.",
        },
        { status: 500 }
      );
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

    const preferredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const modelsToTry = Array.from(
      new Set([preferredModel, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"])
    );

    let lastError = "";

    for (const model of modelsToTry) {
      // Retry up to 2 times for temporary high-demand / rate-limit spikes
      for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) {
          await delay(1000 * attempt);
        }

        try {
          const response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey.trim(),
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
            const errMsg = geminiData.error?.message || "Gemini API error";

            // High demand (503 / 429 temporary spike) -> retry
            if (response.status === 503 || errMsg.toLowerCase().includes("demand") || errMsg.toLowerCase().includes("overloaded")) {
              lastError = errMsg;
              continue; // try next attempt or fallback model
            }

            if (response.status === 400 && errMsg.includes("API key")) {
              throw new Error("Invalid Gemini API Key format or key expired. Please verify your key at https://aistudio.google.com/app/apikey.");
            } else if (response.status === 429 && errMsg.includes("limit: 0")) {
              throw new Error("Quota limit 0 for this key on this model. Please use a free API Key starting with 'AIzaSy...' from Google AI Studio.");
            }

            lastError = errMsg;
            break; // Try next model in loop
          }

          const parts = geminiData.candidates?.[0]?.content?.parts || [];
          const textPart = parts.find((p: { text?: string }) => typeof p.text === "string" && p.text.length > 0);

          if (!textPart || !textPart.text) {
            lastError = "Gemini returned an empty text part";
            break;
          }

          const parsed = extractJson(textPart.text);
          return NextResponse.json(parsed);
        } catch (err: any) {
          if (err.message && err.message.includes("Invalid Gemini API Key")) {
            throw err;
          }
          lastError = err.message || "Failed to analyze resume";
        }
      }
    }

    throw new Error(lastError || "High demand on Gemini API. Please try again in a few seconds.");
  } catch (error: unknown) {
    let message = error instanceof Error ? error.message : "Unexpected error";
    if (message === "fetch failed") {
      message = "Network connection to Gemini API failed. Please check your internet connection or firewall/proxy settings.";
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
