import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let cachedModelName: string | null = null;

export async function POST(req: Request) {
  try {
    const { question, financialSummary, businessName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("your-gemini-api-key")) {
      return NextResponse.json({
        answer: `[API Key Missing] GEMINI_API_KEY is not detected. Please verify GEMINI_API_KEY in Vercel Settings -> Environment Variables.`,
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
        maxOutputTokens: 600,
      },
    };

    // 1. Dynamically query Google for the active models on this key
    let modelName = cachedModelName;

    if (!modelName) {
      try {
        const listRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
        );
        const listData = await listRes.json();

        if (listData.models && listData.models.length > 0) {
          const supported = listData.models.find(
            (m: any) =>
              m.supportedGenerationMethods?.includes("generateContent") &&
              (m.name.includes("flash") || m.name.includes("pro"))
          );
          if (supported) {
            modelName = supported.name; // e.g. "models/gemini-2.0-flash" or "models/gemini-2.5-flash"
            cachedModelName = modelName;
          }
        }
      } catch (err) {
        console.warn("Dynamic model lookup notice:", err);
      }
    }

    // Candidate list fallback in case discovery is throttled
    const candidateModels = modelName
      ? [modelName]
      : [
          "models/gemini-2.0-flash",
          "models/gemini-2.5-flash",
          "models/gemini-2.5-flash-lite",
          "models/gemini-1.5-flash-001",
        ];

    let lastError: any = null;

    for (const mod of candidateModels) {
      try {
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/${mod}:generateContent?key=${cleanKey}`;
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": cleanKey,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          cachedModelName = mod;
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
      answer: `Gemini Notice: ${lastError?.message || "Failed to reach model. Please verify API key permissions in Google AI Studio."}`,
    });
  } catch (error: any) {
    console.error("Copilot Engine Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Copilot processing fault." },
      { status: 500 }
    );
  }
}
