import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Home, MapPin, MessageCircle, UserPlus, UserCheck, ShieldCheck, Plus } from "lucide-react";
import ProductCard from "@/shared/ui/ProductCard";
import Tabs from "@/shared/ui/Tabs";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Logo from "@/shared/ui/Logo";
import Button from "@/shared/ui/Button";
import ReviewList from "@/features/profile/components/ReviewList";
import EmptyState from "@/shared/ui/EmptyState";
import ProductReviews from "@/features/products/components/ProductReviews";
import { useSellerProfile, useFollowUser, useUnfollowUser } from "@/features/profile/hooks/useUsers";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useSellerReviews } from "@/features/reviews/hooks/useReviews";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatDate } from "@/shared/utils/format";
import toast from "react-hot-toast";

export default function SellerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: seller, isLoading } = useSellerProfile(id);
  const [isFollowing, setIsFollowing] = useState(false);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  useEffect(() => {
    setIsFollowing(seller?.isFollowing ?? false);
  }, [seller?.isFollowing]);

  const { data: sellerProductsRaw = [] } = useProducts({ sellerId: id });
  const sellerProducts = sellerProductsRaw?.data || sellerProductsRaw || [];
  const { data: sellerReviewsRaw = [] } = useSellerReviews(id);
  const sellerReviews = sellerReviewsRaw?.data || sellerReviewsRaw || [];

  if (!seller) {
    return (
      <EmptyState
        icon={Home}
        title="Vendeur introuvable"
        description="Ce profil vendeur n'existe pas ou a été supprimé."
      />
    );
  }

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Connectez-vous pour suivre ce vendeur");
      navigate("/connexion");
      return;
    }
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(id);
        setIsFollowing(false);
      } else {
        await followUser.mutateAsync(id);
        setIsFollowing(true);
      }
    } catch {
      toast.error("Erreur lors du suivi");
    }
  };

  const handleContact = () => {
    if (!currentUser) {
      toast.error("Connectez-vous pour contacter ce vendeur");
      navigate("/connexion");
      return;
    }
    navigate(`/messages/${seller.id}`);
  };

  const isOwnProfile = currentUser?.id === Number(id);

  const roleLabel = seller.role === "admin" ? "Admin" : (seller.productCount || sellerProducts.length) > 0 ? "Vendeur" : "Acheteur";

  const tabs = [
    {
      id: "annonces",
      label: "Annonces",
      count: sellerProducts.length,
      content: sellerProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.images?.[0]}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.city || product.location}
              neighborhood={product.neighborhood}
              condition={product.condition}
              hasActiveNegotiation={product.hasActiveNegotiation}
              hasActiveEscrow={product.hasActiveEscrow}
              quantity={product.quantity}
              status={product.status}
              isUrgent={product.isUrgent}
              isPromoted={product.isPromoted}
              isFeatured={product.isFeatured}
              negotiable={product.negotiable}
              onClick={() => navigate(`/annonce/${product.id}`)}
              className="[&>div:last-child]:p-2 md:[&>div:last-child]:p-3"
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
      id: "a-propos",
      label: "À propos",
      content: (
        <div className="border-b border-gray-100 py-4 dark:border-gray-800">
          {seller.bio ? (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{seller.bio}</p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucune présentation pour le moment.</p>
          )}
        </div>
      ),
    },
    {
      id: "avis",
      label: "Avis",
      count: sellerReviews.length,
      content: <ProductReviews sellerId={seller.id} />,
    },
  ];

  return (
    <>
      {/* Desktop sticky header - full width */}
      <div className="sticky  top-0 z-40 hidden bg-white shadow-sm md:block dark:bg-gray-800">
        <div className="mx-auto max-w-7xl pb-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/")} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Retour à l'accueil">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ESPACE {seller.name.toUpperCase()}
              </h1>
            </div>
            <Logo size="sm" className="w-14 h-14" />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 items-center md:grid-cols-[auto_1fr_1fr_1fr]">
            <div className="flex flex-col items-center md:flex-row md:items-start md:gap-4">
              <Avatar src={seller.avatar} name={seller.name} size="md" verified={seller.verified} className="md:hidden" />
              <Avatar src={seller.avatar} name={seller.name} size="xl" verified={seller.verified} className="hidden md:block" />
            </div>

            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white md:text-xl">{seller.name}</h2>
              {seller.city && (
                <p className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm md:justify-start">
                  <MapPin className="h-4 w-4" />
                  {seller.district ? `${seller.district}, ${seller.city}` : seller.city}
                </p>
              )}
              <div className="md:hidden">
                <span className="inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
                  {roleLabel}
                </span>
              </div>
              {seller.bio && (
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 md:text-sm">{seller.bio}</p>
              )}
            </div>

            <div className="space-y-4 text-center md:text-left">
              <p className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">
                Membre depuis {formatDate(seller.joinedAt, { month: "short", year: "numeric" })}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {!isOwnProfile ? (
                  <>
                    <Button variant="primary" size="sm" icon={MessageCircle} onClick={handleContact}>
                      Contacter
                    </Button>
                    <Button
                      variant={isFollowing ? "secondary" : "outline"}
                      size="sm"
                      icon={isFollowing ? UserCheck : UserPlus}
                      onClick={handleFollow}
                      loading={followUser.isPending || unfollowUser.isPending}
                    >
                      {isFollowing ? "Suivi" : "Suivre"}
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => navigate("/parametres")}>
                    Modifier le profil
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <div className="hidden md:block">
                <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
                  {roleLabel}
                </span>
              </div>
              {isOwnProfile && (
                <Link to="/lot/creer">
                  <Button variant="secondary" size="sm" icon={Plus}>
                    Créer un lot
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 md:pb-6">
        {/* Mobile header bar */}
        <div className="sticky -mx-4 top-0 z-40 flex items-center gap-2 bg-white px-4 py-2 shadow-sm md:hidden dark:bg-gray-800">
          <button onClick={() => navigate("/")} className="p-1 text-gray-600 dark:text-gray-400">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Avatar src={seller.avatar} name={seller.name} size="sm" verified={seller.verified} />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{seller.name}</p>
            <span className="inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
              {roleLabel}
            </span>
          </div>
        </div>

        <Tabs tabs={tabs} />

        {/* Mobile bottom action bar */}
        {!isOwnProfile && (
          <div className="fixed inset-x-0 bottom-0 z-[210] border-t border-gray-200 bg-white px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Button variant="primary" fullWidth size="sm" icon={MessageCircle} onClick={handleContact}>
                <span className="flex items-center gap-1.5">Contacter</span>
              </Button>
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                fullWidth
                size="sm"
                icon={UserPlus}
                onClick={handleFollow}
                loading={followUser.isPending || unfollowUser.isPending}
              >
                <span className="flex items-center gap-1.5">{isFollowing ? "Suivi" : "Suivre"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
