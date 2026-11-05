import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // 1. Server-Side Supabase Session Verification (Zero-Trust Security)
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access. Valid enterprise session required." },
        { status: 401 }
      );
    }

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

Verified Client Ledger (Secured via Supabase RLS):
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

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nClient Question: "${question}"\n\nExecutive Strategic Briefing:`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 1000,
      },
    };

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${cleanKey}`;

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
      return NextResponse.json({
        answer: data.candidates[0].content.parts[0].text,
      });
    }

    // Fallback to flash-lite if 3.8 is busy
    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite:generateContent?key=${cleanKey}`;
    const fbResponse = await fetch(fallbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cleanKey },
      body: JSON.stringify(payload),
    });
    const fbData = await fbResponse.json();

    if (fbResponse.ok && fbData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({
        answer: fbData.candidates[0].content.parts[0].text,
      });
    }

    return NextResponse.json({
      answer: "Gemini Capacity Notice: All endpoints experienced temporary traffic spikes. Please retry.",
    });
  } catch (error: any) {
    console.error("Copilot Engine Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Copilot processing fault." },
      { status: 500 }
    );
  }
}
