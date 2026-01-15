"use client";
// import useDataCoin from "@/hooks/use-data-coin";
import {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { UseDataCoinProps } from "@/types/coin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

//Format functions import
import { formatCurrency } from "@/providers/formats/formatCurrency";
import { formatPercentage } from "@/providers/formats/formatPercentage";

export interface CoinTableRef {
  refresh: () => void;
}

export interface CoinTableProps {
  showFilter: boolean;
}

const CoinTable = forwardRef<CoinTableRef, CoinTableProps>(
  ({ showFilter }, ref) => {
    const [data, setData] = useState<UseDataCoinProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch coin data");
        }
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchData,
    }));

    useEffect(() => {
      fetchData();
    }, []);

    const filteredData = useMemo(() => {
      if (!searchQuery.trim()) {
        return data;
      }
      const query = searchQuery.toLowerCase().trim();
      return data.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.symbol.toLowerCase().includes(query)
      );
    }, [data, searchQuery]);

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-destructive mb-2 text-lg font-semibold">
            😭 Error loading data
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6 space-y-4">
          {showFilter && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading market data..."
              : searchQuery
              ? `Found ${filteredData.length} coin${
                  filteredData.length !== 1 ? "s" : ""
                }`
              : "🔥List of top 20 coins"}
          </p>
        </div>

        <div className="rounded-lg border bg-card max-w-7xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Coin Name</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 max-w-1xl">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-28" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No coins found matching your search"
                        : "No coins found"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{item.market_cap_rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-8 overflow-hidden rounded-full">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-muted-foreground text-xs uppercase">
                            {item.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.current_price, "USD")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          item.price_change_percentage_24h >= 0
                            ? "default"
                            : "destructive"
                        }
                        className={
                          item.price_change_percentage_24h >= 0
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        {formatPercentage(item.price_change_percentage_24h)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
);

CoinTable.displayName = "CoinTable";

export default CoinTable;
