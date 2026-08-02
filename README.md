# Resume Analyzer & Job Matcher

An AI-powered application built with Next.js and Google Gemini API that analyzes resumes, generates ATS scores, provides detailed improvement recommendations, and matches candidate profiles to job titles.

---

## 🔑 Setting Up Gemini API Key

The application requires a Google Gemini API key to process and analyze resume PDFs.

### Option 1: Set in Environment Variables (Recommended for local & deployment)

1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a `.env.local` file in the project root directory:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

> **For Vercel / Portfolio Hosting:** Add `GEMINI_API_KEY` under **Environment Variables** in your hosting dashboard settings (e.g. Vercel Project Settings > Environment Variables).

### Option 2: Enter Key Directly in the App UI

If running live from a portfolio link or without `.env.local`, click **⚙️ Configure API Key** at the top of the app interface and paste your key. The key will be saved safely in your browser's `localStorage`.

---

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
