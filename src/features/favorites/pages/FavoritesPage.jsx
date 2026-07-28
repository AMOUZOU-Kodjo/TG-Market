import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import ProductCard from "@/shared/ui/ProductCard";
import EmptyState from "@/shared/ui/EmptyState";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const navigate = useNavigate();
  const favorites = data?.data || data?.favorites || data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyState
          icon={Heart}
          title="Aucun favori pour le moment"
          description="Parcourez les annonces et ajoutez vos coups de coeur pour les retrouver facilement."
          action={
            <Link to="/">
              <Button icon={Search} size="lg">
                Explorer les annonces
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes favoris
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? "annonce" : "annonces"} sauvegardée{favorites.length === 1 ? "" : "s"}
          </p>
        </div>
        <Badge variant="primary" size="md">
          <Heart className="h-3 w-3" />
          {favorites.length}
        </Badge>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {favorites.map((fav) => {
          const product = fav.product || fav;
          const images = product.images || [];
          const firstImage = typeof images[0] === "string" ? images[0] : images[0]?.url;
          const sellerName = product.seller?.name || "";
          const location = product.city || "";

          return (
            <motion.div key={fav.id || product.id} variants={itemVariants}>
              <ProductCard
                productId={product.id}
                image={firstImage}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                location={location}
                neighborhood={product.neighborhood}
                condition={product.condition}
                hasActiveNegotiation={product.hasActiveNegotiation}
                isUrgent={product.isUrgent}
                isPromoted={product.isPromoted}
                isFeatured={product.isFeatured}
                negotiable={product.negotiable}
                isFavorite={true}
                onClick={() => navigate(`/annonce/${product.id}`)}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
