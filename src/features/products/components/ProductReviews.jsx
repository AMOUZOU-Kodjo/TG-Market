import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";
import { useSellerReviews } from "@/features/reviews/hooks/useReviews";
import Avatar from "@/shared/ui/Avatar";
import Rating from "@/shared/ui/Rating";
import { formatRelativeTime } from "@/shared/utils/format";

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
        {star}★
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
          className="h-full rounded-full bg-yellow-500"
        />
      </div>
      <span className="w-8 text-xs text-gray-500 dark:text-gray-400">
        {count}
      </span>
    </div>
  );
}

export default function ProductReviews({ productId, sellerId }) {
  const { data: reviewsData } = useSellerReviews(sellerId);
  const reviews = reviewsData?.data || reviewsData || [];

  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.id);
  }, [reviews]);

  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      if (dist[r.rating] !== undefined) dist[r.rating]++;
    });
    return dist;
  }, [productReviews]);

  const totalReviews = productReviews.length;
  const avgRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / totalReviews;
  }, [productReviews, totalReviews]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Avis ({totalReviews})
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[620px_1fr]">
        <div className="rounded-2xl  border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgRating.toFixed(1)}
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(avgRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {totalReviews} avis
            </p>
          </div>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={distribution[star]}
                total={totalReviews}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Avis réservés aux acheteurs vérifiés
                </p>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                  Seuls les acheteurs ayant finalisé un achat via la plateforme peuvent laisser un avis.
                </p>
              </div>
            </div>
          </div>

          {productReviews.slice(0, 8).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={review.reviewer?.avatar}
                  name={review.reviewer?.name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {review.reviewer?.name}
                    </h4>
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Rating value={review.rating} size="sm" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {totalReviews === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
              <Star className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucun avis pour ce vendeur pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
