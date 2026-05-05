'use client';

import { useState, useEffect } from 'react';

export function usePrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/price/current');
        if (res.ok) {
          const data = await res.json();
          setPrice(data.price ?? null);
        }
      } catch {
        // silently retry
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5_000);
    return () => clearInterval(interval);
  }, []);

  return { price, isLoading };
}
