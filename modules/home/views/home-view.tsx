"use client";
import { useRef, useState } from "react";
import CoinTable, { CoinTableRef } from "../components/coin-table";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, FilterXIcon } from "lucide-react";

export default function HomeView() {
  const [showFilter, setShowFilter] = useState(false);
  const coinTableRef = useRef<CoinTableRef>(null);

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleRefresh = () => {
    coinTableRef.current?.refresh();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="sm:block lg:flex items-center justify-between gap-3 mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Gecko Coin Market
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-300"
            onClick={handleShowFilter}
            aria-label="Refresh data"
          >
            {showFilter ? (
              <Filter className="size-4" />
            ) : (
              <FilterXIcon className="size-4 text-destructive" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-300"
            onClick={handleRefresh}
            aria-label="Refresh data"
          >
            <RefreshCw className="size-4" />
          </Button>
          <AnimatedThemeToggler />
        </div>
      </div>
      <CoinTable ref={coinTableRef} showFilter={showFilter} />
    </div>
  );
}
