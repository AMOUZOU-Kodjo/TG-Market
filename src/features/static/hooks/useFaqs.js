import { useQuery } from "@tanstack/react-query";
import { faqApi } from "../services/faq.api";

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: faqApi.getAll,
    staleTime: 30 * 60 * 1000,
  });
}
