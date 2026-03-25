import { NextRequest, NextResponse } from "next/server";
import { LENNY_SYSTEM_PROMPT } from "@/lib/lenny-system-prompt";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "חסר מפתח API של Claude. הגדר ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: LENNY_SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", errText);
      return NextResponse.json(
        { error: "שגיאה מ-Claude API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data.content?.[0]?.text || "לא הצלחתי לעבד את הבקשה.";

    return NextResponse.json({ message: assistantMessage });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "שגיאה פנימית בשרת" },
      { status: 500 }
    );
  }
}
