import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const vaultStateSchema = z.object({
  address: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Vault address required' },
        { status: 400 }
      );
    }

    const vault = await prisma.vault.findUnique({
      where: { address },
      include: {
        hedgePositions: {
          where: { status: 'OPEN' },
          orderBy: { openedAt: 'desc' },
        },
      },
    });

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      vault: {
        address: vault.address,
        totalAssets: vault.totalAssets.toString(),
        totalShares: vault.totalShares.toString(),
        currentNav: vault.currentNav.toString(),
        peakNav: vault.peakNav.toString(),
        activeHedge: vault.activeHedge,
        hedgePositions: vault.hedgePositions.map(h => ({
          id: h.id,
          size: h.size.toString(),
          entryPrice: h.entryPrice.toString(),
          openedAt: h.openedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('Vault state error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
