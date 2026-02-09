import { NextResponse } from 'next/server'

export const runtime = 'nodejs'; // Use Node.js runtime to avoid edge issues

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
