import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { question, financialSummary, businessName } = await req.json();

    // 1. Validate Input (Prevents Prompt Injection)
    if (typeof question !== "string" || question.length > 500) {
      return NextResponse.json({ error: "Invalid input length" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const systemPrompt = `You are the MARGIN Copilot. Analyze the provided FINANCIAL_DATA (in JSON format) to answer the USER_QUESTION.
    
    FINANCIAL_DATA: ${JSON.stringify(financialSummary)}
    
    INSTRUCTIONS:
    - Act as a senior financial partner.
    - Provide exact numerical citations from the FINANCIAL_DATA.
    - If the user asks for a calculation, perform it using the provided numbers.
    - If the data is missing, state it clearly.
    - Response must be under 200 words.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUSER_QUESTION: ${question}` }] }],
      }),
    });

    const data = await response.json();
    return NextResponse.json({ answer: data.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch (err) {
    return NextResponse.json({ error: "Service fault" }, { status: 500 });
  }
}
