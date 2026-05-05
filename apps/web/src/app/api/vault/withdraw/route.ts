import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '@/lib/backend/modules/vault/vault.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';
import { withAuth } from '@/lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const { shares } = await req.json();
      const result = await vaultService.withdraw(walletAddress, shares);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
