import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import Rating from "@/shared/ui/Rating";
import EmptyState from "@/shared/ui/EmptyState";
import { cn } from "@/shared/utils/cn";
import { formatRelativeTime } from "@/shared/utils/format";

export default function ReviewList({ reviews = [], className }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Aucun avis"
        description="Ce vendeur n'a pas encore reçu d'avis."
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {reviews.map((review, i) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
        >
          <div className="flex items-start gap-3">
            <Avatar
              src={review.reviewer?.avatar}
              name={review.reviewer?.name}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {review.reviewer?.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Rating value={review.rating} size="sm" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>

              {review.productTitle && (
                <p className="mt-1 text-xs text-red-800">
                  Achat : {review.productTitle}
                </p>
              )}

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {review.comment}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
