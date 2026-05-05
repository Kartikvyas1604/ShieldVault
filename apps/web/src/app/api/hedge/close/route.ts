import { NextRequest, NextResponse } from 'next/server';
import { hedgeService } from '@/lib/backend/modules/hedge/hedge.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';
import { withAuth } from '@/lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const { hedgePositionId } = await req.json();
      await hedgeService.closeHedge(hedgePositionId, 'MANUAL');
      return NextResponse.json({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  });
}
