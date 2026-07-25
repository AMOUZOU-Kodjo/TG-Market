import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, MessageSquarePlus, Send, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { reviewSchema } from "@/shared/utils/validators";
import { mockReviews } from "@/data/reviews";
import { useAuth } from "@/shared/contexts/AuthContext";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import Textarea from "@/shared/ui/Textarea";
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

export default function ProductReviews({ productId, reviews: propReviews }) {
  const reviews = propReviews || mockReviews;
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productTitle && r.id),
    [reviews]
  );

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data) => {
    if (newRating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Votre avis a été envoyé !");
    reset();
    setNewRating(0);
    setShowForm(false);
  };

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
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            icon={MessageSquarePlus}
            onClick={() => setShowForm(!showForm)}
          >
            Laisser un avis
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 text-center">
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
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
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="rounded-2xl border border-red-300 bg-red-50/50 p-5 dark:border-red-800/20 dark:bg-red-800/5"
                >
                  <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Votre avis
                  </h3>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                      Note
                    </label>
                    <Rating
                      value={newRating}
                      size="lg"
                      interactive
                      onChange={(val) => setNewRating(val)}
                    />
                    {newRating === 0 && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Cliquez sur une étoile
                      </p>
                    )}
                  </div>

                  <Textarea
                    label="Votre commentaire"
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows={3}
                    maxLength={1000}
                    showCount
                    error={errors.comment?.message}
                    {...register("comment")}
                  />

                  <div className="mt-3 flex gap-3">
                    <Button
                      type="submit"
                      size="sm"
                      loading={isSubmitting}
                      icon={Send}
                    >
                      Envoyer
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowForm(false);
                        setNewRating(0);
                        reset();
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {productReviews.slice(0, 8).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
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
              <TrendingUp className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucun avis pour ce produit. Soyez le premier !
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
