import { NextRequest, NextResponse } from 'next/server';
import { proofService } from '@/lib/backend/modules/proof/proof.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: Promise<{ hedgePositionId: string }> }) {
  try {
    const proof = await proofService.getProof((await params).hedgePositionId);
    return NextResponse.json(proof || { message: 'Proof not found' });
  } catch (error) {
    return handleApiError(error);
  }
}
