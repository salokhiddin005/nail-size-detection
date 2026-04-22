import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, website } = body ?? {};

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)." },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    if (dbError) {
      console.error("contact_messages insert failed:", dbError.message);
      return NextResponse.json(
        { error: "Could not save your message. Please try again." },
        { status: 500 }
      );
    }

    await Promise.allSettled([
      sendTelegram(cleanName, cleanEmail, cleanMessage),
      sendEmail(cleanName, cleanEmail, cleanMessage),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

async function sendTelegram(name: string, email: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram not configured — skipping notification.");
    return;
  }

  const text =
    `🆕 <b>New contact message</b>\n\n` +
    `<b>Name:</b> ${escapeHtml(name)}\n` +
    `<b>Email:</b> ${escapeHtml(email)}\n\n` +
    `<b>Message:</b>\n${escapeHtml(message)}`;

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
  }
}

async function sendEmail(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.warn("Resend not configured — skipping email.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Nailytics Contact <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `New contact message from ${name}`,
      html: buildEmailHtml(name, email, message),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend send failed:", res.status, err);
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildEmailHtml(name: string, email: string, message: string) {
  return `<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; padding: 24px; background: #fafafa;">
    <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <h2 style="margin: 0 0 8px; color: #111;">New contact message</h2>
      <p style="margin: 0 0 16px; color: #666;">Someone reached out via the Nailytics contact form.</p>
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <td style="padding:8px 0; color:#666; width:90px;">Name</td>
          <td style="padding:8px 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#666;">Email</td>
          <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
      </table>
      <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
      <p style="white-space: pre-wrap; line-height: 1.6; color:#111; margin:0;">${escapeHtml(message)}</p>
    </div>
  </body>
</html>`;
}
