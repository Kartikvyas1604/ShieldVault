import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    pythPrice: 142.32,
    jupiterPrice: 142.38,
    consensusPrice: 142.35,
    isValid: true,
    capturedAt: new Date().toISOString(),
  });
}
