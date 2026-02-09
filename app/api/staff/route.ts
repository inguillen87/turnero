import { NextRequest, NextResponse } from "next/server";
import { getStaff, createStaff } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const staffSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  const staff = await getStaff(slug);
  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  try {
    const body = await req.json();
    const data = staffSchema.parse(body);
    const staffMember = await createStaff(slug, data);
    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
