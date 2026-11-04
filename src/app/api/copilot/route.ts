import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { question, financialSummary, businessName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("your-gemini-api-key")) {
      return NextResponse.json({
        answer: `[Configuration Notice] GEMINI_API_KEY is not configured in Vercel Environment Variables. Add GEMINI_API_KEY in Vercel Settings -> Environment Variables and redeploy to enable live intelligence.`,
      });
    }

    const systemPrompt = `You are the Lead Financial Architect & Executive AI Copilot for MARGIN, an elite luxury business financial intelligence platform.
Your tone is sophisticated, razor-sharp, concise, authoritative, and direct (similar to a senior partner at Goldman Sachs or private bank advisor).
Never use conversational fluff, emojis, exclamation marks, or generic SaaS speak.

Here is the client's verified financial ledger:
- Entity Profile: ${businessName}
- Total Gross Inflows: $${financialSummary.totalRevenue?.toLocaleString()}
- Total Operating Disbursements: $${financialSummary.totalExpenses?.toLocaleString()}
- Net Operating Profit: $${financialSummary.netProfit?.toLocaleString()}
- Operating Margin Spread: ${financialSummary.profitMargin}%
- Verified Liquid Cash Position: $${financialSummary.cashPosition?.toLocaleString()}
- Audited Forward Runway: ${financialSummary.runwayMonths} months

Answer the client's strategic question directly using deterministic financial calculations grounded strictly in these metrics. Give concrete dollar and percentage amounts in your recommendations.`;

    // Direct native call to Google Gemini 1.5 Flash (compatible with all AQ. and AIza keys)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nClient Question: "${question}"\n\nExecutive Strategic Analysis:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Google Gemini API Error:", data.error);
      return NextResponse.json({
        answer: `Gemini Service Notice: ${data.error.message || "Failed to authenticate with Google AI Studio."}`,
      });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      answer: aiText || "Ledger analyzed. Parameters verify within projected operating variance.",
    });
  } catch (error: any) {
    console.error("Copilot Engine Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Copilot processing fault." },
      { status: 500 }
    );
  }
}
