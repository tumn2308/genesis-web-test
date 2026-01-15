"use client";
import useDataCoin from "@/hooks/use-data-coin";
import { useEffect, useState } from "react";
import { UseDataCoinProps } from "@/types/coin";

export default function CoinList() {
  const [data, setData] = useState<UseDataCoinProps[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
      ).then((res) => res.json());
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Coin List</h1>
      {data.map((item, index) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.symbol}</p>
          <p>{item.current_price}</p>
        </div>
      ))}
    </div>
  );
}
