import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/admin-data";
import { localProducts, mapRowToProduct, type Product } from "@/lib/products";

/**
 * Returns the static catalog immediately (SSR-safe, zero loading state) and
 * transparently swaps in admin-panel data once it arrives on the client.
 */
export function useLiveProducts(fallback: Product[] = localProducts): Product[] {
  const { data } = useQuery({
    queryKey: ["live-products"],
    queryFn: async () => {
      const rows = await fetchProducts();
      return rows.map(mapRowToProduct);
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: true,
  });

  return data && data.length > 0 ? data : fallback;
}
