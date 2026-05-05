import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '@/lib/backend/modules/vault/vault.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  try {
    const result = await vaultService.getState((await params).walletAddress);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
