import { NextRequest, NextResponse } from 'next/server';
import { consensusService } from '@/lib/backend/modules/price/consensus.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const result = await consensusService.getPriceHistory(30);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
