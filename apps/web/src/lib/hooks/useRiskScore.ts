import { useEffect, useState } from 'react';

interface RiskMetrics {
  overall: number;
  priceRisk: number;
  predictionRisk: number;
  volatilityRisk: number;
  liquidityRisk: number;
}

export function useRiskScore() {
  const [riskScore, setRiskScore] = useState<RiskMetrics>({
    overall: 0,
    priceRisk: 0,
    predictionRisk: 0,
    volatilityRisk: 0,
    liquidityRisk: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateRiskScore = async () => {
      try {
        // Fetch real volatility data from Pyth
        const response = await fetch(
          'https://hermes.pyth.network/api/latest_price_feeds?ids[]=0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'
        );
        const data = await response.json();

        if (data[0]?.price) {
          const price = Number(data[0].price.price) * Math.pow(10, data[0].price.expo);
          const confidence = Number(data[0].price.conf) * Math.pow(10, data[0].price.expo);

          // Calculate volatility risk from confidence interval
          const volatilityRisk = Math.min(100, (confidence / price) * 10000);

          // Price risk based on recent price movement (simplified)
          const priceRisk = Math.min(100, volatilityRisk * 0.8);

          // Placeholder for prediction and liquidity risk (would need additional APIs)
          const predictionRisk = 50;
          const liquidityRisk = 30;

          const overall = (priceRisk + predictionRisk + volatilityRisk + liquidityRisk) / 4;

          setRiskScore({
            overall,
            priceRisk,
            predictionRisk,
            volatilityRisk,
            liquidityRisk,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to calculate risk score:', error);
        setLoading(false);
      }
    };

    calculateRiskScore();
    const interval = setInterval(calculateRiskScore, 10000);

    return () => clearInterval(interval);
  }, []);

  return { riskScore, loading };
}
