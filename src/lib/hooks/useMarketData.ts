import { useEffect, useState } from 'react';

interface PythPrice {
  price: number;
  confidence: number;
  timestamp: number;
}

interface JupiterPrice {
  price: number;
  timestamp: number;
}

interface MarketData {
  pythPrice: PythPrice | null;
  jupiterPrice: JupiterPrice | null;
  loading: boolean;
  error: string | null;
}

export function useMarketData(symbol: string = 'SOL') {
  const [data, setData] = useState<MarketData>({
    pythPrice: null,
    jupiterPrice: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch Pyth price
        const pythResponse = await fetch(
          `https://hermes.pyth.network/api/latest_price_feeds?ids[]=0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d`
        );
        const pythData = await pythResponse.json();

        const pythPrice = pythData[0]?.price ? {
          price: Number(pythData[0].price.price) * Math.pow(10, pythData[0].price.expo),
          confidence: Number(pythData[0].price.conf) * Math.pow(10, pythData[0].price.expo),
          timestamp: pythData[0].price.publish_time * 1000,
        } : null;

        // Fetch Jupiter price (using correct v6 API endpoint)
        const jupiterResponse = await fetch(
          `https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112`,
          { cache: 'no-store' }
        );

        if (!jupiterResponse.ok) {
          throw new Error(`Jupiter API error: ${jupiterResponse.status}`);
        }

        const jupiterData = await jupiterResponse.json();

        const jupiterPrice = jupiterData.data?.So11111111111111111111111111111111111111112 ? {
          price: jupiterData.data.So11111111111111111111111111111111111111112.price,
          timestamp: Date.now(),
        } : null;

        setData({
          pythPrice,
          jupiterPrice,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch market data',
        }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return data;
}
