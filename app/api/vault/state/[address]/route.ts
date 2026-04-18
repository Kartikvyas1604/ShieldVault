import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  return NextResponse.json({
    solAmount: 2.5,
    shares: 2500000,
    status: 'ACTIVE',
  });
}
