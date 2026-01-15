"use client";

import useSWR from "swr";
import { UseDataCoinProps } from "@/types/coin";

const useDataCoin = () => {
  const fetchData = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`
    );
    const data = await response.json();
    return data;
  };
  const { data, isLoading, error } = useSWR<UseDataCoinProps>(fetchData);
  return { data, isLoading, error };
};

export default useDataCoin;
