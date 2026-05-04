import { NextRequest, NextResponse } from 'next/server';
import { PriceService } from '@/lib/services/price.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '60');

    const priceService = PriceService.getInstance();
    const history = await priceService.getPriceHistory(minutes);

    return NextResponse.json({
      history: history.map(h => ({
        consensus: h.consensus.toString(),
        jupiter: h.jupiter?.toString(),
        pyth: h.pyth?.toString(),
        switchboard: h.switchboard?.toString(),
        timestamp: h.timestamp,
      })),
    });
  } catch (error) {
    console.error('NAV history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
