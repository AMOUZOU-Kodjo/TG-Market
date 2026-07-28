import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, Star, Heart, Edit3, ShieldCheck, Lock, Bell, Trash2,
  Loader2, Eye, EyeOff, AlertTriangle, Shield, ShieldOff, Camera,
  ShoppingCart, BarChart3, Handshake, TrendingUp, MapPin, Calendar,
  CheckCircle, XCircle, MessageCircle, Clock, Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Modal from "@/shared/ui/Modal";
import Tabs from "@/shared/ui/Tabs";
import ProductCard from "@/shared/ui/ProductCard";
import ReviewList from "@/features/profile/components/ReviewList";
import EmptyState from "@/shared/ui/EmptyState";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import ProductTable from "@/features/dashboard/components/ProductTable";
import toast from "react-hot-toast";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { useMyProducts, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { productsApi } from "@/features/products/services/products.api";
import { useMyReviews } from "@/features/reviews/hooks/useReviews";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useKycStatus } from "@/features/verification/hooks/useKyc";
import { useEscrowList, useWalletBalance } from "@/features/wallet/hooks/useWallet";
import { useReceivedBundleProposals, useAcceptBundleProposal, useRejectBundleProposal } from "@/features/bundles/hooks/useBundleProposals";
import { usersApi } from "@/features/profile/services/users.api";
import { cn } from "@/shared/utils/cn";
import { formatDate, formatCFA, formatRelativeTime } from "@/shared/utils/format";

const escrowStatusConfig = {
  completed: { label: "Terminée", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  paid: { label: "Payée", variant: "primary" },
  pending_delivery: { label: "Expédiée", variant: "info" },
  delivered: { label: "Livrée", variant: "info" },
  disputed: { label: "Litige", variant: "danger" },
  cancelled: { label: "Annulée", variant: "danger" },
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Annonces récentes</h3>
        <ProductTable />
      </div>
    </div>
  );
}

const statusConfig = {
  active: { label: "En ligne" },
  paused: { label: "En pause" },
  sold: { label: "Vendu" },
  draft: { label: "Brouillon" },
};
const statusLabel = (s) => statusConfig[s]?.label ?? s;

function ProductsTab({ products }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.title} » ?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Annonce supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "paused" : "active";
    try {
      await productsApi.updateStatus(product.id, newStatus);
      qc.invalidateQueries({ queryKey: ["myProducts"] });
      toast.success(newStatus === "active" ? "Annonce réactivée" : "Annonce mise en pause");
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes annonces ({products.length})</h3>
        <button
          onClick={() => navigate("/vendre")}
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors"
        >
          <Package className="h-4 w-4" />
          Nouvelle annonce
        </button>
      </div>
      {products.length === 0 ? (
        <EmptyState icon={Package} title="Aucune annonce" description="Publiez votre première annonce pour commencer à vendre." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                isUrgent={product.isUrgent}
                isPromoted={product.isPromoted}
                isFeatured={product.isFeatured}
                negotiable={product.negotiable}
                onClick={() => navigate(`/annonce/${product.id}`)}
              />
              <div className="flex items-center justify-end gap-1 border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-2xl bg-white dark:bg-gray-800 px-3 py-2">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mr-auto",
                  product.status === "active" && "bg-brand-100 text-brand-700",
                  product.status === "paused" && "bg-yellow-50 text-yellow-600",
                  product.status === "sold" && "bg-gray-100 text-gray-600",
                  product.status === "draft" && "bg-gray-50 text-gray-400",
                )}>
                  {statusLabel(product.status)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleStatus(product); }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  title={product.status === "active" ? "Mettre en pause" : "Réactiver"}
                >
                  {product.status === "active" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/modifier/${product.id}`); }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-800 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                  title="Modifier"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const navigate = useNavigate();
  const { data: escrowData, isLoading } = useEscrowList();
  const escrows = escrowData?.data ?? escrowData?.escrows ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes commandes</h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : escrows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Commande</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">Acheteur</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Montant</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {escrows.map((order) => {
                  const status = escrowStatusConfig[order.status] || { label: order.status, variant: "neutral" };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer" onClick={() => navigate(`/commandes/${order.id}`)}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">#{order.id.toString().slice(0, 8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.productTitle}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:table-cell">{order.buyerName}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 md:table-cell">{formatCFA(order.amount)}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 lg:table-cell">{formatRelativeTime(order.createdAt)}</td>
                      <td className="px-4 py-3"><Badge variant={status.variant} dot>{status.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function BundleProposalsTab() {
  const navigate = useNavigate();
  const { data, isLoading } = useReceivedBundleProposals();
  const acceptProposal = useAcceptBundleProposal();
  const rejectProposal = useRejectBundleProposal();
  const proposals = data?.data ?? [];

  const statusBadge = (status) => {
    const map = {
      pending: { label: "En attente", icon: Clock, class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      accepted: { label: "Acceptée", icon: CheckCircle, class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      rejected: { label: "Refusée", icon: XCircle, class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
      cancelled: { label: "Annulée", icon: XCircle, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    };
    const s = map[status] || map.pending;
    return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.class}`}><s.icon className="h-3 w-3" />{s.label}</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Propositions de lots</h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <Handshake className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune proposition reçue</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Acheteur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Lot</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">Montant</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{p.buyer?.firstName || "Acheteur"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.bundle?.title ?? `Lot #${p.bundleId}`}</td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 sm:table-cell">{formatCFA(p.proposedPrice)}</td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 md:table-cell">{formatRelativeTime(p.createdAt)}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const { data: myProductsData } = useMyProducts();
  const { data: walletData } = useWalletBalance();
  const products = myProductsData?.data ?? [];
  const topProducts = [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const maxViews = Math.max(...topProducts.map((p) => p.views || 0), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Statistiques</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{(products.reduce((s, p) => s + (p.views || 0), 0)).toLocaleString("fr-FR")}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenus totaux</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{formatCFA(walletData?.totalEarned ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Annonces actives</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{products.filter((p) => p.status === "active").length}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Produits les plus vus</h4>
        {topProducts.length === 0 ? <p className="text-sm text-gray-400">Aucune donnée disponible</p> : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700 dark:text-gray-300">{p.title}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full rounded-full bg-brand-700" style={{ width: `${((p.views || 0) / maxViews) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500">{p.views || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardProfilePage() {
  const { user, setUser } = useAuth();
  const { supportEmail } = useSiteSettings();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: myProductsData } = useMyProducts();
  const { data: myReviewsData } = useMyReviews();
  const { data: favoritesData } = useFavorites();
  const { data: kycStatus } = useKycStatus();

  const myProducts = (myProductsData?.data || myProductsData || []).filter((p) => p.seller?.id === user?.id);
  const myReviews = (myReviewsData?.data || myReviewsData || []).filter((r) => r.reviewer?.id === user?.id);
  const favoriteProducts = (favoritesData?.data || favoritesData || []).map((fav) => fav.product || fav);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", bio: user?.bio || "", avatar: user?.avatar || "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const preferencesMutation = useMutation({
    mutationFn: (data) => usersApi.updatePreferences(data),
    onSuccess: () => toast.success("Préférences sauvegardées !"),
    onError: (err) => toast.error(err?.response?.data?.message || "Erreur"),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => usersApi.changePassword(data),
    onSuccess: () => { setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); toast.success("Mot de passe modifié !"); },
    onError: (err) => toast.error(err?.response?.data?.message || "Erreur"),
  });

  const handleNotificationChange = (key, value) => {
    preferencesMutation.mutate({ [key]: value });
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) { toast.error("Saisissez votre mot de passe actuel"); return; }
    if (passwordData.newPassword.length < 8) { toast.error("Min. 8 caractères"); return; }
    if (!/[A-Z]/.test(passwordData.newPassword)) { toast.error("Une majuscule requise"); return; }
    if (!/[a-z]/.test(passwordData.newPassword)) { toast.error("Une minuscule requise"); return; }
    if (!/[0-9]/.test(passwordData.newPassword)) { toast.error("Un chiffre requis"); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return; }
    passwordMutation.mutate({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
  };

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

  const isEmailVerified = !!kycStatus?.emailVerified;
  const isPhoneVerified = !!kycStatus?.phoneVerified;

  const roleLabel = user?.role === "admin" ? "Admin" : myProducts.length > 0 ? "Vendeur" : "Acheteur";

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3, content: <OverviewTab /> },
    { id: "products", label: "Mes annonces", icon: Package, count: myProducts.length, content: <ProductsTab products={myProducts} /> },
    { id: "orders", label: "Commandes", icon: ShoppingCart, content: <OrdersTab /> },
    { id: "proposals", label: "Propositions", icon: Handshake, content: <BundleProposalsTab /> },
    { id: "analytics", label: "Statistiques", icon: TrendingUp, content: <AnalyticsTab /> },
    { id: "favorites", label: "Favoris", icon: Heart, count: favoriteProducts.length, content: (
      favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} productId={product.id} image={product.images?.[0]} title={product.title}
              price={product.price} originalPrice={product.originalPrice} location={product.city || product.location}
              neighborhood={product.neighborhood} condition={product.condition}
              hasActiveNegotiation={product.hasActiveNegotiation} isUrgent={product.isUrgent}
              isPromoted={product.isPromoted} isFeatured={product.isFeatured} negotiable={product.negotiable}
              isFavorite onClick={() => navigate(`/annonce/${product.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Heart} title="Aucun favori" description="Ajoutez des produits en favoris pour les retrouver ici." />
      )
    )},
    { id: "reviews", label: "Avis", icon: Star, count: myReviews.length, content: <ReviewList reviews={myReviews} /> },
    { id: "settings", label: "Paramètres", icon: Settings, content: (
      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"><Shield className="h-4 w-4 text-brand-800" />Compte</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">Email</p><p className="text-xs text-gray-500">{user?.email}</p></div>
              {isEmailVerified ? <Badge variant="success"><ShieldCheck className="h-3 w-3" />Vérifié</Badge> : <Badge variant="warning"><ShieldOff className="h-3 w-3" />Non vérifié</Badge>}
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p><p className="text-xs text-gray-500">{user?.phone || "Non renseigné"}</p></div>
              {isPhoneVerified ? <Badge variant="success"><ShieldCheck className="h-3 w-3" />Vérifié</Badge> : <Badge variant="warning"><ShieldOff className="h-3 w-3" />Non vérifié</Badge>}
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"><Lock className="h-4 w-4 text-brand-800" />Mot de passe</h3>
          <div className="space-y-3">
            <div className="relative">
              <Input label="Mot de passe actuel" type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="Saisissez votre mot de passe actuel" />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            <div className="relative">
              <Input label="Nouveau mot de passe" type={showNewPassword ? "text" : "password"} value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Min. 8 caractères, majuscule, minuscule, chiffre" />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            <Input label="Confirmer le mot de passe" type="password" value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="Retapez le nouveau mot de passe" />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handlePasswordChange} disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}Modifier le mot de passe
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"><Bell className="h-4 w-4 text-brand-800" />Notifications</h3>
          <div className="space-y-4">
            {[
              { key: "notificationsPush", label: "Notifications push", desc: "Recevoir les alertes sur votre téléphone" },
              { key: "notificationsEmail", label: "Notifications email", desc: "Recevoir les alertes par email" },
              { key: "notificationsSms", label: "Notifications SMS", desc: "Recevoir les alertes par SMS" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" checked={user?.[item.key] ?? (item.key !== "notificationsSms")}
                    onChange={(e) => handleNotificationChange(item.key, e.target.checked)} disabled={preferencesMutation.isPending} />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-800 after:peer-checked:translate-x-full dark:bg-gray-700" />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-950/30 dark:bg-red-950/10">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-400"><AlertTriangle className="h-4 w-4" />Zone dangereuse</h3>
          <p className="mb-3 text-sm text-red-800/80 dark:text-red-400/70">La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.</p>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteModalOpen(true)}>Supprimer mon compte</Button>
        </div>
      </div>
    )},
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-800 to-brand-700 h-32 sm:h-40" />
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" verified={user?.identity_verified} className="ring-4 ring-white dark:ring-gray-800" />
            <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.name}</h1>
                <span className="inline-flex self-start rounded-full bg-brand-100 dark:bg-brand-900/30 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:text-brand-400">{roleLabel}</span>
                {user?.identity_verified && <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0" />}
              </div>
              {user?.city && <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1"><MapPin className="h-4 w-4" />{user?.district ? `${user.district}, ${user.city}` : user.city}</p>}
              {user?.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{user.bio}</p>}
              <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Calendar className="h-3.5 w-3.5" />Membre depuis {formatDate(user?.createdAt || user?.created_at, { month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2 sm:pb-1">
              <Button variant="primary" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)}>Modifier</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
              <Package className="h-4 w-4 text-brand-700 dark:text-brand-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{myProducts.length}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Annonces</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
              <Heart className="h-4 w-4 text-brand-700 dark:text-brand-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{favoriteProducts.length}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Favoris</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
              <Star className="h-4 w-4 text-brand-700 dark:text-brand-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{myReviews.length}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Avis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs tabs={tabs} />

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

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Supprimer mon compte" size="md"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Annuler</Button><Button variant="danger" disabled>Confirmer la suppression</Button></div>}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-950/20">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-400">Cette action est irréversible</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400/70">Toutes vos annonces, messages, favoris et données seront définitivement supprimés.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pour des raisons de sécurité, la suppression de compte n'est pas encore disponible en ligne. Veuillez contacter le support à <span className="font-medium">{supportEmail}</span> pour demander la suppression de votre compte.</p>
        </div>
      </Modal>
    </div>
  );
}
