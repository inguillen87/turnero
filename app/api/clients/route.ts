import { NextRequest, NextResponse } from "next/server";

const MOCK_CLIENTS = [
    { id: "1", name: "Juan Perez", email: "juan@example.com", phone: "123456789" },
    { id: "2", name: "Maria Garcia", email: "maria@example.com", phone: "987654321" },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_CLIENTS);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Mock create client" }, { status: 201 });
}
