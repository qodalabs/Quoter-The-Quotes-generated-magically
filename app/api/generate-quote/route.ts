import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, tone, authorStyle } = await req.json();
    if (!topic || !tone || !authorStyle) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a world-class quotesmith.\n\nGenerate a short, original, and impactful quote. The quote should be about the topic of "${topic}" and have a ${tone} tone. Please attribute the quote to a fictional author in the style of "${authorStyle}".\n\nReturn ONLY a single JSON object with two fields and no code fences or commentary: {"quote": string, "author": string}.`;

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result.response.text().trim();

    // Attempt to parse JSON; strip code fences if present
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // fallback: try to extract JSON braces
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON from model");
      parsed = JSON.parse(match[0]);
    }

    if (!parsed?.quote || !parsed?.author) {
      throw new Error("Malformed response from model");
    }

    return NextResponse.json({ quote: parsed.quote, author: parsed.author });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
