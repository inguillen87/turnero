import { NextRequest, NextResponse } from "next/server";

const MOCK_STAFF = [
    { id: "1", name: "Dr. Roberto", active: true },
    { id: "2", name: "Dra. Ana", active: true },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STAFF);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Mock create staff" }, { status: 201 });
}
