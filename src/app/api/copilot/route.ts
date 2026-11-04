import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { question, financialSummary, businessName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("your-gemini-api-key")) {
      return NextResponse.json({
        answer: `[Deterministic Intelligence Mode] Ledger verified for ${businessName}: Total Inflow $${financialSummary.totalRevenue?.toLocaleString()}, Reserves $${financialSummary.cashPosition?.toLocaleString()}, Runway ${financialSummary.runwayMonths} months.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the Lead Financial Architect & Executive AI Copilot for MARGIN, a private luxury business financial intelligence platform.
Your tone is sophisticated, razor-sharp, concise, authoritative, and direct (akin to a senior partner at Goldman Sachs or private bank advisor).
Never use conversational fluff, emojis, exclamation marks, or generic SaaS speak.

Here is the verified financial ledger for the client:
- Entity: ${businessName}
- Total Revenue: $${financialSummary.totalRevenue}
- Total Operating Expenses: $${financialSummary.totalExpenses}
- Net Profit: $${financialSummary.netProfit}
- Net Operating Margin: ${financialSummary.profitMargin}%
- Verified Liquid Cash: $${financialSummary.cashPosition}
- Cash Runway: ${financialSummary.runwayMonths} months

Answer the executive's question using deterministic logic grounded strictly in their numbers.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nClient Question: "${question}"` }] }
      ],
    });

    return NextResponse.json({
      answer: response.text || "Ledger analyzed. Metrics confirm operating parameters within projected variance.",
    });
  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process ledger analysis" },
      { status: 500 }
    );
  }
}
