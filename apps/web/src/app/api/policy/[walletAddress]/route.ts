import { NextRequest, NextResponse } from 'next/server';
import { policyService } from '@/lib/backend/modules/policy/policy.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';
import { withAuth } from '@/lib/backend/middleware/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  try {
    const result = await policyService.getActiveRule((await params).walletAddress);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ walletAddress: string }> }) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      if (walletAddress !== (await params).walletAddress) throw new Error('Unauthorized');
      const result = await policyService.deactivateRule(walletAddress);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
