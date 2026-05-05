import { NextRequest, NextResponse } from 'next/server';
import { consensusService } from '@/lib/backend/modules/price/consensus.service';
import { handleApiError } from '@/lib/backend/apiErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const result = consensusService.getCurrentPrice();
    return NextResponse.json(result || { error: 'Price not available yet' });
  } catch (error) {
    return handleApiError(error);
  }
}
