import { NextRequest, NextResponse } from 'next/server';
import { policyService } from '@/lib/backend/modules/policy/policy.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';
import { withAuth } from '@/lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const body = await req.json();
      const result = await policyService.createRule(walletAddress, {
        triggerPercent: body.triggerPercent,
        hedgePercent: body.hedgePercent,
        timeoutMinutes: body.timeoutMinutes
      });
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
