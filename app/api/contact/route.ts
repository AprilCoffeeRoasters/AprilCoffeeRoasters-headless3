import { createFreshdeskTicket } from "lib/freshdesk";
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

  if (!process.env.FRESHDESK_API_KEY?.trim()) {
    console.error("FRESHDESK_API_KEY is not configured");
    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  const subject = `Contact form — ${fullName} — Order ${orderNumber}`;
  const description = [
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `Order number: ${orderNumber}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const result = await createFreshdeskTicket({
      email,
      name: fullName,
      subject,
      description,
    });

    if (!result.ok) {
      console.error("Freshdesk error:", result.status, result.detail);
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
