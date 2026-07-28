import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Filter, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import Rating from "@/shared/ui/Rating";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Textarea from "@/shared/ui/Textarea";
import { useMyReviews } from "@/features/reviews/hooks/useReviews";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { formatRelativeTime } from "@/shared/utils/format";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

function RatingDistribution({ reviews }) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-2">
      {distribution.map(({ stars, count }) => (
        <div key={stars} className="flex items-center gap-3">
          <span className="w-8 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
            {stars} <Star className="inline h-3 w-3 fill-yellow-500 text-yellow-500" />
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(count / maxCount) * 100}%` }}
              transition={{ duration: 0.8, delay: (5 - stars) * 0.1, ease: "easeOut" }}
              className="h-full rounded-full bg-yellow-500"
            />
          </div>
          <span className="w-8 text-xs text-gray-500 dark:text-gray-400">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const { siteName } = useSiteSettings();
  const { data: reviewsData = [] } = useMyReviews();
  const [filter, setFilter] = useState("all");
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const reviews = reviewsData?.data || reviewsData || [];
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === "positive") return r.rating >= 4;
    if (filter === "negative") return r.rating <= 3;
    return true;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }
    toast.success("Merci pour votre avis !");
    setNewRating(0);
    setNewComment("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Avis</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {reviews.length} avis de la communauté {siteName}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Rating Overview */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {avgRating.toFixed(1)}
              </span>
              <Rating value={Math.round(avgRating)} size="lg" className="mt-2" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {reviews.length} avis
              </p>
            </div>
            <div className="flex-1">
              <RatingDistribution reviews={reviews} />
            </div>
          </div>
        </motion.div>

        {/* Write Review Form */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <MessageSquare className="h-5 w-5 text-brand-800" />
            Laisser un avis
          </h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Votre note
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoverRating || newRating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              label="Votre commentaire"
              placeholder="Partagez votre expérience avec ce vendeur ou ce produit..."
              rows={3}
              maxLength={500}
              showCount
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" icon={MessageSquare}>
                Publier l'avis
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          {[
            { id: "all", label: "Tous", icon: Filter },
            { id: "positive", label: "Positifs", icon: ThumbsUp },
            { id: "negative", label: "Négatifs", icon: ThumbsDown },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-brand-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
              {f.id === "positive" && (
                <span className="ml-0.5">({reviews.filter((r) => r.rating >= 4).length})</span>
              )}
              {f.id === "negative" && (
                <span className="ml-0.5">({reviews.filter((r) => r.rating <= 3).length})</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Reviews List */}
        <motion.div
          variants={containerVariants}
          className="space-y-4"
        >
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={review.reviewer.avatar}
                  name={review.reviewer.name}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.reviewer.name}
                    </p>
                    <Rating value={review.rating} size="sm" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-brand-800">
                    {review.productTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-brand-700 dark:hover:text-brand-600">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Utile
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-700 dark:hover:text-red-400">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredReviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucun avis {filter === "positive" ? "positif" : "négatif"} pour le moment.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
