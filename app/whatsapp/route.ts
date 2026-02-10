import { handleTwilioWebhook } from "@/app/api/webhooks/twilio/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handleTwilioWebhook(req);
}

export async function GET() {
  return new Response("OK /whatsapp -> Twilio webhook", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
