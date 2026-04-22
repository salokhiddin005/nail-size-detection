import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, website } = body ?? {};

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (typeof name !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)." },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram env vars missing.");
      return NextResponse.json(
        { error: "Chat is not configured. Please try the contact form instead." },
        { status: 500 }
      );
    }

    const text =
      `💬 <b>Quick chat</b>\n\n` +
      `<b>From:</b> ${escapeHtml(cleanName)}\n\n` +
      `<b>Message:</b>\n${escapeHtml(cleanMessage)}`;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Telegram send failed:", res.status, err);
      return NextResponse.json(
        { error: "Could not deliver your message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("telegram-chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
