import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/backend/db/client';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { wallet_address: (await params).walletAddress },
      orderBy: { timestamp: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return handleApiError(error);
  }
}
