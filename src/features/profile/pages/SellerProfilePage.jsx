import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import ProductCard from "@/shared/ui/ProductCard";
import Tabs from "@/shared/ui/Tabs";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ReviewList from "@/features/profile/components/ReviewList";
import EmptyState from "@/shared/ui/EmptyState";
import { mockUsers } from "@/data/users";
import { mockProducts } from "@/data/products";
import { mockReviews } from "@/data/reviews";
import { cn } from "@/shared/utils/cn";

export default function SellerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const seller = mockUsers.find((u) => u.id === Number(id));
  const sellerProducts = mockProducts.filter(
    (p) => p.seller?.id === Number(id)
  );
  const sellerReviews = mockReviews.filter(
    (r) => r.reviewer?.id === Number(id)
  );

  if (!seller) {
    return (
      <EmptyState
        icon={Home}
        title="Vendeur introuvable"
        description="Ce profil vendeur n'existe pas ou a été supprimé."
      />
    );
  }

  const aboutItems = [
    { label: "Nom complet", value: seller.name },
    { label: "Ville", value: seller.district ? `${seller.district}, ${seller.city}` : seller.city },
    { label: "Membre depuis", value: new Date(seller.joinedAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) },
    { label: "Note moyenne", value: `${seller.rating}/5 (${seller.reviewCount} avis)` },
  ];

  const tabs = [
    {
      id: "annonces",
      label: "Annonces",
      count: sellerProducts.length,
      content: sellerProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.images?.[0]}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.location}
              seller={product.seller}
              condition={product.condition}
              negotiable={product.negotiable}
              onClick={() => navigate(`/annonce/${product.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucune annonce"
          description="Ce vendeur n'a pas encore d'annonces."
        />
      ),
    },
    {
      id: "avis",
      label: "Avis",
      count: sellerReviews.length,
      content: <ReviewList reviews={sellerReviews} />,
    },
    {
      id: "about",
      label: "À propos",
      content: (
        <div className="max-w-2xl space-y-6">
          {seller.bio && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {seller.bio}
              </p>
            </div>
          )}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Informations
            </h3>
            <div className="space-y-3">
              {aboutItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/", icon: Home },
          { label: "Vendeurs", href: "/vendeurs" },
          { label: seller.name },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfileHeader
          user={seller}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing(!isFollowing)}
          onMessage={() => {}}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs tabs={tabs} />
      </motion.div>
    </div>
  );
}
