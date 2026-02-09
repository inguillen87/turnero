import { NextRequest, NextResponse } from "next/server";
import { getServices, createService } from "@/lib/db";
import { getTenantSlug } from "@/lib/tenant"; // Assuming this is safe or we use a mock one
import { z } from "zod";

export const runtime = "nodejs";

const serviceSchema = z.object({
  name: z.string().min(1),
  durationMin: z.number().int().positive(),
  price: z.number().min(0),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  const services = await getServices(slug);
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);
    const service = await createService(slug, data);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
