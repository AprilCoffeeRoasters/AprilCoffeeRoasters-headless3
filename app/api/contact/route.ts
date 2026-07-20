import { CONTACT_TO_EMAIL } from "lib/contact/faq-content";
import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  fullName?: unknown;
  email?: unknown;
  orderNumber?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ContactPayload;

  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = asTrimmedString(body.fullName);
  const email = asTrimmedString(body.email);
  const orderNumber = asTrimmedString(body.orderNumber);
  const message = asTrimmedString(body.message);

  if (!fullName || !email || !orderNumber || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "April Coffee <onboarding@resend.dev>";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? CONTACT_TO_EMAIL;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  const subject = `Contact form — ${fullName} — Order ${orderNumber}`;
  const text = [
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `Order number: ${orderNumber}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <p><strong>Full name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Order number:</strong> ${escapeHtml(orderNumber)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.json();
      console.error("Resend error:", response.status, detail);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
