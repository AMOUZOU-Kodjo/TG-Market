import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../services/search.api";

export function useSearch(params) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchApi.search(params),
    enabled: !!(params?.q || (params?.categories && params.categories.length > 0) || params?.minPrice || params?.maxPrice || params?.sort || params?.city || params?.verifiedSeller || params?.deliveryAvailable || params?.negotiable || params?.urgent || params?.onPromotion),
  });
}
