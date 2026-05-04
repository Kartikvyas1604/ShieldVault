import { NextResponse } from 'next/server';
import { PriceService } from '@/lib/services/price.service';

export async function GET() {
  try {
    const priceService = PriceService.getInstance();

    const [price, isStale, volatility] = await Promise.all([
      priceService.getConsensusPrice().catch(() => null),
      priceService.isPriceStale(),
      priceService.getVolatility(30).catch(() => 0),
    ]);

    return NextResponse.json({
      status: 'healthy',
      price: price?.toString() || 'unavailable',
      priceStale: isStale,
      volatility: volatility.toFixed(4),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Service check failed' },
      { status: 503 }
    );
  }
}
