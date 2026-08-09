import { useState, useRef } from "react";
import {
  Package, Star, Heart, Edit3, ShieldCheck, Bell,
  Loader2, Camera, Eye, Trash2,
  TrendingUp, MapPin, MessageCircle, Settings,
} from "lucide-react";
import BackButton from "@/shared/ui/BackButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Modal from "@/shared/ui/Modal";
import Tabs from "@/shared/ui/Tabs";
import ProductCard from "@/shared/ui/ProductCard";
import ReviewList from "@/features/profile/components/ReviewList";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import EmptyState from "@/shared/ui/EmptyState";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";

import toast from "react-hot-toast";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMyProducts, useDeleteProduct, useEndNegotiation } from "@/features/products/hooks/useProducts";
import { useMyReviews } from "@/features/reviews/hooks/useReviews";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useWalletBalance } from "@/features/wallet/hooks/useWallet";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { usersApi } from "@/features/profile/services/users.api";
import { formatDate, formatCFA, formatRelativeTime } from "@/shared/utils/format";

function ProductsTab({ products }) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();
  const endNegotiation = useEndNegotiation();

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.title} » ?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Annonce supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEndNegotiation = async (product) => {
    if (!window.confirm(`Arrêter la négociation pour « ${product.title} » ?`)) return;
    try {
      await endNegotiation.mutateAsync(product.id);
      toast.success("Négociation arrêtée");
    } catch {
      toast.error("Erreur lors de l'arrêt de la négociation");
    }
  };

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes annonces (0)</h3>
          <button
            onClick={() => navigate("/vendre")}
            className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors w-full sm:w-auto justify-center"
          >
            <Package className="h-4 w-4" />
            Nouvelle annonce
          </button>
        </div>
        <EmptyState icon={Package} title="Aucune annonce" description="Publiez votre première annonce pour commencer à vendre." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Mes annonces ({products.length})
        </h3>
        <button
          onClick={() => navigate("/vendre")}
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors w-full sm:w-auto justify-center"
        >
          <Package className="h-4 w-4" />
          Nouvelle annonce
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard
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
            />
            <div className="flex items-center justify-between gap-1 border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-2xl bg-white dark:bg-gray-800 px-2 py-2">
              <span className="flex items-center gap-1 text-xs text-gray-400" title="Vues">
                <Eye className="h-3 w-3" />
                {product.views || 0}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/annonce/${product.id}`);
                  }}
                  className="rounded-lg bg-brand-50 p-1.5 text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30"
                  title="Voir l'annonce"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/modifier/${product.id}`);
                  }}
                  className="rounded-lg bg-blue-50 p-1.5 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  title="Modifier l'annonce"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                {product.hasActiveNegotiation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEndNegotiation(product);
                    }}
                    className="rounded-lg bg-yellow-50 p-1.5 text-yellow-700 transition-colors hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                    title="Arrêter la négociation"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product);
                  }}
                  className="rounded-lg bg-red-50 p-1.5 text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  title="Supprimer l'annonce"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { data: myProductsData } = useMyProducts();
  const { data: myReviewsData } = useMyReviews();
  const { data: favoritesData } = useFavorites();
  const { data: walletData } = useWalletBalance();
  const { data: conversationsData } = useConversations();

  const myProducts = myProductsData?.data || myProductsData || [];
  const myReviews = (myReviewsData?.data || myReviewsData || []).filter((r) => r.reviewer?.id === user?.id);
  const favoriteProducts = (favoritesData?.data || favoritesData || []).map((fav) => fav.product || fav);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", bio: user?.bio || "", avatar: user?.avatar || "" });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Sélectionnez une image"); return; }
    setIsUploadingAvatar(true);
    try {
      const result = await usersApi.uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatar: result.avatar }));
      setUser((prev) => ({ ...prev, avatar: result.avatar }));
      toast.success("Photo mise à jour !");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const roleLabel = user?.role === "admin" ? "Admin" : myProducts.length > 0 ? "Vendeur" : "Acheteur";
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || undefined;

  const tabs = [
    { id: "products", label: "Mes annonces", icon: Package, count: myProducts.length, content: <ProductsTab products={myProducts} /> },
    { id: "favorites", label: "Favoris", icon: Heart, count: favoriteProducts.length, content: (
      favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} productId={product.id} image={product.images?.[0]} title={product.title}
              price={product.price} originalPrice={product.originalPrice} location={product.city || product.location}
              neighborhood={product.neighborhood} condition={product.condition}
              hasActiveNegotiation={product.hasActiveNegotiation} hasActiveEscrow={product.hasActiveEscrow}
              quantity={product.quantity} status={product.status} isUrgent={product.isUrgent}
              isPromoted={product.isPromoted} isFeatured={product.isFeatured} negotiable={product.negotiable}
              isFavorite onClick={() => navigate(`/annonce/${product.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Heart} title="Aucun favori" description="Ajoutez des produits en favoris pour les retrouver ici." />
      )
    )},
    { id: "reviews", label: "Avis", icon: Star, count: myReviews.length, content: <ReviewList reviews={myReviews} /> },
    { id: "notifications", label: "Notifications", icon: Bell, content: <NotificationsPage /> },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenue, {user?.name?.split(" ")[0] || "👋"}</h1>
      </div>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Gérez votre profil, vos annonces et vos activités.</p>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto">
            <Avatar src={user?.avatar} name={user?.name} size={isMobile ? "sm" : "xl"} verified={user?.identity_verified} className="ring-2 ring-gray-100 dark:ring-gray-700 shrink-0" />
            <h1 className="text-base font-bold text-gray-900 dark:text-white sm:hidden flex-1 min-w-0 truncate">{user?.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:hidden">
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{roleLabel}</span>
            {user?.identity_verified && <ShieldCheck className="h-4 w-4 text-green-600" />}
            {user?.city && <span className="text-xs text-gray-500 truncate">{user?.district ? `${user.district}, ${user.city}` : user.city}</span>}
            <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)} className="ml-auto shrink-0" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{roleLabel}</span>
              {user?.identity_verified && <ShieldCheck className="hidden sm:block h-4 w-4 text-green-600" />}
            </div>
            {user?.city && <p className="hidden sm:block text-sm text-gray-500 mt-0.5">{user?.district ? `${user.district}, ${user.city}` : user.city}</p>}
            {user?.bio && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{user.bio}</p>}
            <p className="text-xs text-gray-400 mt-1">Membre depuis {formatDate(user?.createdAt || user?.created_at, { month: "short", year: "numeric" })}</p>
          </div>
          <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)} className="hidden sm:inline-flex shrink-0">Modifier</Button>
        </div>
        <div className="hidden sm:block mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-1 h-20 w-20  gap-5">
            <div className="rounded-full  dark:bg-gray-900/50 p-1 sm:p-2 aspect-square flex flex-col items-center justify-center">
              <div className="w-5 h-5 rounded bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-0.5 sm:mb-1">
                <Package className="h-2.5 w-2.5 text-brand-600" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{myProducts.length}</p>
              <span className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-wider">Annonces</span>
            </div>
            <div className="rounded-full  dark:bg-gray-900/50 p-1 sm:p-2 aspect-square flex flex-col items-center justify-center">
              <div className="w-5 h-5 rounded bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-0.5 sm:mb-1">
                <TrendingUp className="h-2.5 w-2.5 text-green-600" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCFA(walletData?.totalEarned ?? 0)}</p>
              <span className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-wider">Revenus</span>
            </div>
            <div className="rounded-full  dark:bg-gray-900/50 p-1 sm:p-2 aspect-square flex flex-col items-center justify-center">
              <div className="w-5 h-5 rounded bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-0.5 sm:mb-1">
                <Heart className="h-2.5 w-2.5 text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{favoriteProducts.length}</p>
              <span className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-wider">Favoris</span>
            </div>
            <div className="rounded-full  dark:bg-gray-900/50 p-1 sm:p-2 aspect-square flex flex-col items-center justify-center">
              <div className="w-5 h-5 rounded bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-0.5 sm:mb-1">
                <Star className="h-2.5 w-2.5 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{myReviews.length}</p>
              <span className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-wider">Avis</span>
            </div>
            <div className="rounded-full  dark:bg-gray-900/50 p-1 sm:p-2 aspect-square flex flex-col items-center justify-center">
              <div className="w-5 h-5 rounded bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-0.5 sm:mb-1">
                <MessageCircle className="h-2.5 w-2.5 text-sky-600" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{(conversationsData?.data || conversationsData || []).reduce((s, c) => s + (c.unreadCount || 0), 0)}</p>
              <span className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-wider">Messages</span>
              <span className="hidden sm:block text-[9px] text-gray-400">non lus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs tabs={tabs} defaultTab={initialTab} />

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Modifier le profil" size="md"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditModalOpen(false)}>Annuler</Button><Button variant="primary" onClick={() => setEditModalOpen(false)}>Enregistrer</Button></div>}>
        <div className="space-y-4">
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="flex justify-center">
            <div className="relative">
              {user?.avatar || formData.avatar ? (
                <img src={formData.avatar || user?.avatar} alt={formData.name} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-800">{formData.name?.charAt(0)?.toUpperCase() || "?"}</div>
              )}
              <button type="button" disabled={isUploadingAvatar} onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white shadow-md hover:bg-brand-900 disabled:opacity-50">
                {isUploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <Input label="Nom complet" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Téléphone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Textarea label="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} maxLength={200} showCount rows={3} />
        </div>
      </Modal>
    </div>
  );
}
