import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/backend/db/client';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  try {
    const hedge = await prisma.hedgePosition.findFirst({
      where: { wallet_address: (await params).walletAddress, status: 'OPEN' }
    });
    return NextResponse.json(hedge || { message: 'No active hedge' });
  } catch (error) {
    return handleApiError(error);
  }
}
