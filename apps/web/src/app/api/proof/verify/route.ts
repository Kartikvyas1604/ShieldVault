import { NextRequest, NextResponse } from 'next/server';
import { proofService } from '@/lib/backend/modules/proof/proof.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function POST(req: NextRequest) {
  try {
    const { proofId } = await req.json();
    const result = await proofService.verifyProof(proofId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
