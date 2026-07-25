import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/shared/ui/ProductCard";
import EmptyState from "@/shared/ui/EmptyState";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import { Link } from "react-router-dom";

const favoriteProducts = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra 256GB",
    price: 850000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=450&fit=crop",
    location: "LomÃ©, BÃ©",
    condition: "Neuf",
    negotiable: true,
    seller: { name: "Kofi AmÃ©yo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=2", online: true },
  },
  {
    id: 2,
    title: "Pagne Wax Hollandais 6 yards - Motif Floral",
    price: 25000,
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=450&fit=crop",
    location: "LomÃ©, Agbalepedogan",
    condition: "Neuf",
    seller: { name: "Ama Dzidzornu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&facepad=2", online: true },
  },
  {
    id: 3,
    title: "PS5 + 2 Manettes + 3 Jeux",
    price: 380000,
    originalPrice: 450000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=450&fit=crop",
    location: "LomÃ©, Tokoin",
    condition: "TrÃ¨s bon Ã©tat",
    negotiable: true,
    seller: { name: "KÃ©vin AgbÃ©kÃ©", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=3", online: true },
  },
  {
    id: 4,
    title: "CanapÃ© 3 places en cuir vÃ©ritable",
    price: 350000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop",
    location: "LomÃ©, NyÃ©konakpoÃ©",
    condition: "TrÃ¨s bon Ã©tat",
    seller: { name: "Efua Semonu", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&facepad=2", online: false },
  },
  {
    id: 5,
    title: "MacBook Air M2 13 pouces - 256GB",
    price: 650000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=450&fit=crop",
    location: "LomÃ©, BÃ©",
    condition: "TrÃ¨s bon Ã©tat",
    negotiable: true,
    seller: { name: "Kofi AmÃ©yo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=2", online: true },
  },
  {
    id: 6,
    title: "Kit Panneaux Solaires 300W complet",
    price: 650000,
    originalPrice: 750000,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=450&fit=crop",
    location: "AtakpamÃ©, Agou",
    condition: "Neuf",
    seller: { name: "Kwame Dogbo", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&facepad=2", online: true },
  },
  {
    id: 7,
    title: "Honda CB500F - Motos occasion",
    price: 2200000,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=450&fit=crop",
    location: "Kara, Lama-Kara",
    condition: "Bon Ã©tat",
    negotiable: true,
    seller: { name: "Kossi Mensah", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&facepad=2", online: false },
  },
  {
    id: 8,
    title: "Robe Bazin brodÃ©e - Taille 40",
    price: 45000,
    image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=450&fit=crop",
    location: "LomÃ©, GbossimÃ©",
    condition: "Neuf",
    seller: { name: "Massa Houndjro", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&facepad=3", online: false },
  },
];

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
  const [favorites, setFavorites] = useState(favoriteProducts);

  const handleFavoriteToggle = (id, isLiked) => {
    if (!isLiked) {
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyState
          icon={Heart}
          title="Aucun favori pour le moment"
          description="Parcourez les annonces et ajoutez vos coups de cÅ“ur pour les retrouver facilement."
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
            {favorites.length} {favorites.length === 1 ? "annonce" : "annonces"} sauvegardÃ©e{favorites.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <Heart className="h-3 w-3" />
            {favorites.length}
          </Badge>
          <Button variant="outline" size="sm" icon={SlidersHorizontal}>
            Filtrer
          </Button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {favorites.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              image={product.image}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.location}
              seller={product.seller}
              condition={product.condition}
              negotiable={product.negotiable}
              isFavorite={true}
              onFavoriteToggle={(liked) => handleFavoriteToggle(product.id, liked)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
