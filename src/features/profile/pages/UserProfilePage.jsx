import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit3,
  Heart,
  Star,
  Settings,
  Package,
  Camera,
  Shield,
  ShieldCheck,
  ShieldOff,
  Bell,
  Trash2,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import Tabs from "@/shared/ui/Tabs";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ReviewList from "@/features/profile/components/ReviewList";
import ProductCard from "@/shared/ui/ProductCard";
import EmptyState from "@/shared/ui/EmptyState";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useMyReviews } from "@/features/reviews/hooks/useReviews";
import { usersApi } from "@/features/profile/services/users.api";
import { useKycStatus } from "@/features/verification/hooks/useKyc";
import { cn } from "@/shared/utils/cn";

export default function UserProfilePage() {
  const { user, setUser } = useAuth();
  const { supportEmail } = useSiteSettings();
  const queryClient = useQueryClient();
  const { data: myProductsData } = useMyProducts();
  const { data: myReviewsData } = useMyReviews();
  const { data: kycStatus } = useKycStatus();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const myProducts = (myProductsData?.data || myProductsData || []).filter((p) => p.seller?.id === user?.id);
  const favoriteProducts = (myProductsData?.data || myProductsData || []).slice(0, 3);
  const myReviews = (myReviewsData?.data || myReviewsData || []).filter((r) => r.reviewer?.id === user?.id);

  const notificationsEmail = user?.notificationsEmail ?? true;
  const notificationsPush = user?.notificationsPush ?? true;
  const notificationsSms = user?.notificationsSms ?? false;

  const preferencesMutation = useMutation({
    mutationFn: (data) => usersApi.updatePreferences(data),
    onSuccess: () => {
      toast.success("Préférences sauvegardées !");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur lors de la sauvegarde");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => usersApi.changePassword(data),
    onSuccess: () => {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Mot de passe modifié ! Veuillez vous reconnecter.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur lors du changement de mot de passe");
    },
  });

  const handleNotificationChange = (key, value) => {
    preferencesMutation.mutate({ [key]: value });
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins une majuscule");
      return;
    }
    if (!/[a-z]/.test(passwordData.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins une minuscule");
      return;
    }
    if (!/[0-9]/.test(passwordData.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins un chiffre");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleSave = () => {
    setEditModalOpen(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const result = await usersApi.uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatar: result.avatar }));
      setUser((prev) => ({ ...prev, avatar: result.avatar }));
      toast.success("Photo de profil mise à jour !");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const isEmailVerified = !!kycStatus?.emailVerified;
  const isPhoneVerified = !!kycStatus?.phoneVerified;

  const tabs = [
    {
      id: "products",
      label: "Mes annonces",
      icon: Package,
      count: user?.productCount,
      content: myProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product) => (
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
              isUrgent={product.isUrgent}
              isPromoted={product.isPromoted}
              isFeatured={product.isFeatured}
              negotiable={product.negotiable}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="Aucune annonce"
          description="Vous n'avez pas encore publié d'annonces."
          action={
            <Button variant="primary" size="sm">
              Créer une annonce
            </Button>
          }
        />
      ),
    },
    {
      id: "favorites",
      label: "Favoris",
      icon: Heart,
      count: favoriteProducts.length,
      content: favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteProducts.map((product) => (
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
              isUrgent={product.isUrgent}
              isPromoted={product.isPromoted}
              isFeatured={product.isFeatured}
              negotiable={product.negotiable}
              isFavorite
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Aucun favori"
          description="Ajoutez des produits en favoris pour les retrouver ici."
        />
      ),
    },
    {
      id: "reviews",
      label: "Avis",
      icon: Star,
      count: myReviews.length,
      content: <ReviewList reviews={myReviews} />,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      content: (
        <div className="max-w-2xl space-y-6">
          {/* Compte */}
          <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Shield className="h-4 w-4 text-brand-800" />
              Compte
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                {isEmailVerified ? (
                  <Badge variant="success">
                    <ShieldCheck className="h-3 w-3" />
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <ShieldOff className="h-3 w-3" />
                    Non vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.phone || "Non renseigné"}</p>
                </div>
                {isPhoneVerified ? (
                  <Badge variant="success">
                    <ShieldCheck className="h-3 w-3" />
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <ShieldOff className="h-3 w-3" />
                    Non vérifié
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Lock className="h-4 w-4 text-brand-800" />
              Mot de passe
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  label="Mot de passe actuel"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Saisissez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Nouveau mot de passe"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Min. 8 caractères, majuscule, minuscule, chiffre"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Retapez le nouveau mot de passe"
              />
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePasswordChange}
                  disabled={passwordMutation.isPending}
                >
                  {passwordMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Modifier le mot de passe
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Bell className="h-4 w-4 text-brand-800" />
              Notifications
            </h3>
            <div className="space-y-4">
              {[
                { key: "notificationsPush", label: "Notifications push", desc: "Recevoir les alertes sur votre téléphone" },
                { key: "notificationsEmail", label: "Notifications email", desc: "Recevoir les alertes par email" },
                { key: "notificationsSms", label: "Notifications SMS", desc: "Recevoir les alertes par SMS" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={user?.[item.key] ?? (item.key !== "notificationsSms")}
                      onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                      disabled={preferencesMutation.isPending}
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-800 after:peer-checked:translate-x-full dark:bg-gray-700" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Zone dangereuse */}
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-950/30 dark:bg-red-950/10">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Zone dangereuse
            </h3>
            <p className="mb-3 text-sm text-red-800/80 dark:text-red-400/70">
              La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
            </p>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfileHeader
          user={user}
          isOwnProfile
          onEdit={() => setEditModalOpen(true)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs tabs={tabs} />
      </motion.div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modifier le profil"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div className="flex justify-center">
            <div className="relative">
              {user?.avatar || formData.avatar ? (
                <img
                  src={formData.avatar || user?.avatar}
                  alt={formData.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-800 dark:bg-brand-800/20 dark:text-brand-400">
                  {formData.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white shadow-md hover:bg-brand-900 transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
          <Input
            label="Nom complet"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            maxLength={200}
            showCount
            rows={3}
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Supprimer mon compte"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" disabled>
              Confirmer la suppression
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-950/20">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-400">
                Cette action est irréversible
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400/70">
                Toutes vos annonces, messages, favoris et données seront définitivement supprimés.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pour des raisons de sécurité, la suppression de compte n'est pas encore disponible en ligne. Veuillez contacter le support à <span className="font-medium">{supportEmail}</span> pour demander la suppression de votre compte.
          </p>
        </div>
      </Modal>
    </div>
  );
}
