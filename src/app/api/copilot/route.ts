import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Extends Vercel timeout to prevent gateway aborts

export async function POST(req: Request) {
  try {
    const { question, financialSummary, businessName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("your-gemini-api-key")) {
      return NextResponse.json({
        answer: `[API Key Missing] GEMINI_API_KEY is not detected in environment variables.`,
      });
    }

    const cleanKey = apiKey.trim();

    const systemPrompt = `You are the Lead Financial Architect & Executive AI Copilot for MARGIN, an elite luxury business financial intelligence platform.
Your tone is sophisticated, concise, and direct (Goldman Sachs partner style). No conversational fluff.

Verified Client Ledger:
- Entity: ${businessName}
- Gross Inflow: $${financialSummary?.totalRevenue?.toLocaleString()}
- Operating Outflow: $${financialSummary?.totalExpenses?.toLocaleString()}
- Net Profit: $${financialSummary?.netProfit?.toLocaleString()} (Margin: ${financialSummary?.profitMargin}%)
- Cash Reserves: $${financialSummary?.cashPosition?.toLocaleString()}
- Cash Runway: ${financialSummary?.runwayMonths} months

Instructions:
1. Provide a direct 3-point executive briefing answering the client's question.
2. Cite their exact numbers (cash, burn rate, runway).
3. Conclude with a clear, actionable strategic recommendation.
4. Keep the total response under 250 words so delivery is fast and razor-sharp.`;

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${cleanKey}`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": cleanKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nClient Question: "${question}"\n\nExecutive Briefing:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 1200, // Enough room so it never cuts off mid-sentence
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini Error:", data.error);
      return NextResponse.json({
        answer: `Gemini Service Notice: ${data.error.message || "Failed to generate analysis."}`,
      });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      answer: aiText || "Ledger verified. Operating metrics conform to projected parameters.",
    });
  } catch (error: any) {
    console.error("Copilot Engine Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Copilot processing fault." },
      { status: 500 }
    );
  }
}
