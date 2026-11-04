import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
Your tone is sophisticated, razor-sharp, concise, authoritative, and direct (similar to a senior partner at Goldman Sachs or private bank advisor).
Never use conversational fluff, emojis, exclamation marks, or generic SaaS speak.

Here is the client's verified financial ledger:
- Entity Profile: ${businessName}
- Total Gross Inflows: $${financialSummary?.totalRevenue?.toLocaleString()}
- Total Operating Disbursements: $${financialSummary?.totalExpenses?.toLocaleString()}
- Net Operating Profit: $${financialSummary?.netProfit?.toLocaleString()}
- Operating Margin Spread: ${financialSummary?.profitMargin}%
- Verified Liquid Cash Position: $${financialSummary?.cashPosition?.toLocaleString()}
- Audited Forward Runway: ${financialSummary?.runwayMonths} months

Answer the client's strategic question directly using deterministic financial calculations grounded strictly in these metrics. Give concrete dollar and percentage amounts in your recommendations.`;

    const payload = {
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
        maxOutputTokens: 700,
      },
    };

    // Priority target: Gemini 3.8 Flash
    const candidateEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${cleanKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite:generateContent?key=${cleanKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${cleanKey}`,
    ];

    let lastError: any = null;

    for (const url of candidateEndpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": cleanKey,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return NextResponse.json({
            answer: data.candidates[0].content.parts[0].text,
          });
        }

        if (data.error) {
          lastError = data.error;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return NextResponse.json({
      answer: `Gemini Notice: ${lastError?.message || "Failed to query Gemini 3.8 Flash. Check API key permissions in Google AI Studio."}`,
    });
  } catch (error: any) {
    console.error("Copilot Engine Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Copilot processing fault." },
      { status: 500 }
    );
  }
}
