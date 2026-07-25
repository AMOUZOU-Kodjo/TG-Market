import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Heart,
  Star,
  Settings,
  Package,
  Camera,
  LogOut,
  Shield,
  Bell,
  Trash2,
} from "lucide-react";
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
import { mockCurrentUser } from "@/data/users";
import { mockProducts } from "@/data/products";
import { mockReviews } from "@/data/reviews";
import { cn } from "@/shared/utils/cn";

export default function UserProfilePage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    phone: mockCurrentUser.phone,
    bio: mockCurrentUser.bio,
    avatar: mockCurrentUser.avatar,
  });

  const myProducts = mockProducts.filter((p) => p.seller?.id === 100);
  const favoriteProducts = mockProducts.slice(0, 3);
  const myReviews = mockReviews.filter((r) => r.reviewer?.id === 100);

  const handleSave = () => {
    setEditModalOpen(false);
  };

  const tabs = [
    {
      id: "products",
      label: "Mes annonces",
      icon: Package,
      count: mockCurrentUser.productCount,
      content: myProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.images?.[0]}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.location}
              condition={product.condition}
              hasActiveNegotiation={product.hasActiveNegotiation}
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
              image={product.images?.[0]}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.location}
              condition={product.condition}
              hasActiveNegotiation={product.hasActiveNegotiation}
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
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Shield className="h-4 w-4 text-brand-800" />
              Compte
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{mockCurrentUser.email}</p>
                </div>
                <Badge variant="success">Vérifié</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{mockCurrentUser.phone}</p>
                </div>
                <Badge variant="success">Vérifié</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mot de passe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dernière modification il y a 3 mois</p>
                </div>
                <Button variant="ghost" size="sm">
                  Modifier
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Bell className="h-4 w-4 text-brand-800" />
              Notifications
            </h3>
            <div className="space-y-3">
              {[
                { label: "Notifications push", desc: "Recevoir les alertes sur votre téléphone" },
                { label: "Emails marketing", desc: "Offres et promotions personnalisées" },
                { label: "Alertes de prix", desc: "Quand un produit baisse de prix" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-800 after:peer-checked:translate-x-full dark:bg-gray-700" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-950/30 dark:bg-red-950/10">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-400">
              <Trash2 className="h-4 w-4" />
              Zone dangereuse
            </h3>
            <p className="mb-3 text-sm text-red-800/80 dark:text-red-400/70">
              La suppression de votre compte est irréversible.
            </p>
            <Button variant="danger" size="sm">
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
          user={mockCurrentUser}
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
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white shadow-md hover:bg-brand-900 transition-colors">
                <Camera className="h-3.5 w-3.5" />
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
    </div>
  );
}
