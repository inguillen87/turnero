import { NextRequest, NextResponse } from "next/server";

const MOCK_REPORTS = [
    {
        id: "1",
        startAt: new Date().toISOString(),
        clientName: "Juan Perez",
        status: "confirmed",
        service: { name: "Consulta", price: 15000 },
        staff: { name: "Dr. Roberto" }
    },
    {
        id: "2",
        startAt: new Date(Date.now() + 3600000).toISOString(),
        clientName: "Maria Garcia",
        status: "pending",
        service: { name: "Limpieza", price: 25000 },
        staff: { name: "Dra. Ana" }
    }
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_REPORTS);
}
