import { NextRequest, NextResponse } from "next/server";

const MOCK_SERVICES = [
    { id: "1", name: "Consulta", durationMin: 30, price: 15000, active: true },
    { id: "2", name: "Limpieza", durationMin: 45, price: 25000, active: true },
    { id: "3", name: "Blanqueamiento", durationMin: 60, price: 50000, active: true },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_SERVICES);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Mock create service" }, { status: 201 });
}
