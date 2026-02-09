import { NextRequest, NextResponse } from "next/server";
import { getClients, createClient } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  const clients = await getClients(slug);
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  try {
    const body = await req.json();
    const data = clientSchema.parse(body);
    const client = await createClient(slug, data);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
