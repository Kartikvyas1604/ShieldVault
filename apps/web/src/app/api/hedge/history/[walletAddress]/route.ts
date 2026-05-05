import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/backend/db/client';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  try {
    const history = await prisma.hedgePosition.findMany({
      where: { wallet_address: (await params).walletAddress, status: 'CLOSED' },
      orderBy: { close_timestamp: 'desc' }
    });
    return NextResponse.json(history);
  } catch (error) {
    return handleApiError(error);
  }
}
