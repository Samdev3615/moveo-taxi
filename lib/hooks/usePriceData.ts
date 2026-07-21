"use client";

import { useState, useEffect } from "react";

export type PriceData = {
  car4_day: number;
  car4_night: number;
  car6_day: number;
  car6_night: number;
};

export function usePriceData(from: string, to: string) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [noPrice, setNoPrice] = useState(false);

  useEffect(() => {
    if (!from || !to || from === to) {
      setPriceData(null);
      setNoPrice(false);
      return;
    }
    const controller = new AbortController();
    setLoadingPrice(true);
    setPriceData(null);
    setNoPrice(false);
    fetch(`/api/price?from=${from}&to=${to}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.car4_day) { setPriceData(data); setNoPrice(false); }
        else if (data.no_price) { setNoPrice(true); setPriceData(null); }
      })
      .catch(() => {})
      .finally(() => setLoadingPrice(false));
    return () => controller.abort();
  }, [from, to]);

  return { priceData, loadingPrice, noPrice };
}
