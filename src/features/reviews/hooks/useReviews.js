import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../services/reviews.api";

export function useProductReviews(productId, params) {
  return useQuery({
    queryKey: ["productReviews", productId, params],
    queryFn: () => reviewsApi.getByProduct(productId, params),
    enabled: !!productId,
  });
}

export function useSellerReviews(sellerId, params) {
  return useQuery({
    queryKey: ["sellerReviews", sellerId, params],
    queryFn: () => reviewsApi.getBySeller(sellerId, params),
    enabled: !!sellerId,
  });
}

export function useMyReviews(params) {
  return useQuery({
    queryKey: ["myReviews", params],
    queryFn: () => reviewsApi.getMy(params),
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sellerReviews"] });
      qc.invalidateQueries({ queryKey: ["productReviews"] });
      qc.invalidateQueries({ queryKey: ["myReviews"] });
    },
  });
}

export function useReviewVote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, vote }) => reviewsApi.vote(reviewId, vote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myReviews"] });
      qc.invalidateQueries({ queryKey: ["sellerReviews"] });
      qc.invalidateQueries({ queryKey: ["productReviews"] });
    },
  });
}
