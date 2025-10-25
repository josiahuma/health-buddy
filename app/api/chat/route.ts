import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { reply: "Server is missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please send a message string." },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are HealthBuddy, a friendly AI symptom assistant. 
You help users understand POSSIBLE causes and sensible next steps (self-care tips, when to see a clinician).
You are NOT a doctor and do NOT give medical diagnoses or prescriptions.
Always: 
- use simple language,
- list 3–5 likely possibilities (if appropriate),
- provide red-flag symptoms and when to seek urgent care,
- end with a clear disclaimer that this is general guidance only.
`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // lightweight, fast; change if you prefer
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenAI error:", errText);
      return NextResponse.json(
        { reply: "AI provider error. Please try again." },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { reply: "Something went wrong processing your request." },
      { status: 500 }
    );
  }
}
