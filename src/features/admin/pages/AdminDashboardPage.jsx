import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  List,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  MoreVertical,
  Check,
  X,
  Shield,
  Eye,
  Edit2,
  Trash2,
  Ban,
  UserCheck,
  BarChart3,
  Clock,
  Search,
  ChevronRight,
  ExternalLink,
  FileCheck,
  Camera,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";
import { mockUsers } from "@/data/users";
import { mockCategories } from "@/data/categories";
import { mockPendingVerifications } from "@/data/verification";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const pendingListings = [
  {
    id: 101,
    title: "iPhone 14 Pro Max 256GB - Neuf scellé",
    price: 750000,
    category: "Téléphones",
    seller: mockUsers[0],
    submittedAt: "2025-07-20T08:00:00Z",
    images: 1,
  },
  {
    id: 102,
    title: "Terrain 500m² à Kpéme - Titre foncier",
    price: 15000000,
    category: "Immobilier",
    seller: mockUsers[2],
    submittedAt: "2025-07-19T16:30:00Z",
    images: 1,
  },
  {
    id: 103,
    title: "Set complète de batterie Pearl Export",
    price: 850000,
    category: "Musique",
    seller: mockUsers[7],
    submittedAt: "2025-07-19T14:00:00Z",
    images: 1,
  },
  {
    id: 104,
    title: "Lot de 50 pagnes wax assorted",
    price: 125000,
    category: "Mode & Vêtements",
    seller: mockUsers[1],
    submittedAt: "2025-07-19T10:15:00Z",
    images: 1,
  },
];

const recentActivity = [
  { type: "sale", text: "Samsung Galaxy S24 vendu par Kofi Améyo", time: "Il y a 2h", amount: 850000 },
  { type: "user", text: "Nouvel utilisateur : Kokou Amega", time: "Il y a 3h" },
  { type: "report", text: "Annonce signalée : iPhone trop bon marché", time: "Il y a 4h" },
  { type: "sale", text: "MacBook Air M2 vendu par Prosper Degan", time: "Il y a 5h", amount: 650000 },
  { type: "user", text: "Kévin Agbéké vérifié comme vendeur", time: "Il y a 6h" },
  { type: "listing", text: "Toyota Corolla 2019 ajouté à Kara", time: "Il y a 7h" },
  { type: "report", text: "Utilisateur signalé pour comportement suspect", time: "Il y a 8h" },
];

const activityIcons = {
  sale: { icon: DollarSign, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  user: { icon: Users, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  report: { icon: AlertTriangle, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  listing: { icon: List, color: "text-brand-800", bg: "bg-brand-50 dark:bg-brand-800/10" },
};

export default function AdminDashboardPage() {
  const users = mockUsers.slice(0, 10);
  const [userStatuses, setUserStatuses] = useState(
    Object.fromEntries(users.map((u) => [u.id, u.verified ? "verified" : "active"]))
  );

  const handleBanUser = (userId) => {
    setUserStatuses((prev) => ({ ...prev, [userId]: "banned" }));
    toast.success("Utilisateur banni");
  };

  const handleVerifyUser = (userId) => {
    setUserStatuses((prev) => ({ ...prev, [userId]: "verified" }));
    toast.success("Utilisateur vérifié");
  };

  const handleApproveListing = (id) => {
    toast.success("Annonce approuvée");
  };

  const handleRejectListing = (id) => {
    toast.error("Annonce rejetée");
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Users Management */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-gray-800 bg-gray-900"
        >
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Gestion des utilisateurs</h2>
            <Badge variant="primary">{users.length}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Inscrit</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-800/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-yellow-500">★ {user.rating}</span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={
                          userStatuses[user.id] === "verified"
                            ? "success"
                            : userStatuses[user.id] === "banned"
                            ? "danger"
                            : "warning"
                        }
                        dot
                      >
                        {userStatuses[user.id] === "verified"
                          ? "Vérifié"
                          : userStatuses[user.id] === "banned"
                          ? "Banni"
                          : "Actif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500">
                      {formatRelativeTime(user.joinedAt)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        {userStatuses[user.id] !== "verified" && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="rounded-lg p-1.5 text-brand-600 transition-colors hover:bg-brand-700/10"
                            title="Vérifier"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        {userStatuses[user.id] !== "banned" && (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-700/10"
                            title="Bannir"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800"
                          title="Voir le profil"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Listings */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Annonces en attente</h2>
              <Badge variant="warning" dot>{pendingListings.length}</Badge>
            </div>
            <div className="divide-y divide-gray-800">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{listing.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatCFA(listing.price)} · {listing.category}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        par {listing.seller.name} · {formatRelativeTime(listing.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApproveListing(listing.id)}
                        className="rounded-lg bg-brand-700/10 p-1.5 text-brand-600 transition-colors hover:bg-brand-700/20"
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRejectListing(listing.id)}
                        className="rounded-lg bg-red-700/10 p-1.5 text-red-400 transition-colors hover:bg-red-700/20"
                        title="Rejeter"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Management */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Catégories</h2>
              <Badge variant="secondary">{mockCategories.length}</Badge>
            </div>
            <div className="max-h-[360px] divide-y divide-gray-800 overflow-y-auto">
              {mockCategories.slice(0, 12).map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <span style={{ color: cat.color }}>
                        {cat.icon === "Smartphone" ? "📱" : cat.icon === "Car" ? "🚗" : cat.icon === "Laptop" ? "💻" : "📦"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.productCount} annonces</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-700/10 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* KYC Moderation */}
        {mockPendingVerifications.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Vérifications KYC en attente</h2>
              <Badge variant="warning" dot>{mockPendingVerifications.length}</Badge>
            </div>
            <div className="divide-y divide-gray-800">
              {mockPendingVerifications.map((verification) => (
                <div key={verification.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{verification.name}</p>
                        <Badge variant="secondary" size="sm">{verification.documentType}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Soumis {formatRelativeTime(verification.submittedAt)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <img
                          src={verification.selfieUrl}
                          alt="Selfie"
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <img
                          src={verification.docFrontUrl}
                          alt="Document"
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toast.success(`Identité de ${verification.name} vérifiée`)}
                        className="rounded-lg bg-brand-700/10 p-2 text-brand-600 transition-colors hover:bg-brand-700/20"
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast.error(`Identité de ${verification.name} rejetée`)}
                        className="rounded-lg bg-red-700/10 p-2 text-red-400 transition-colors hover:bg-red-700/20"
                        title="Rejeter"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart Placeholder */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Revenus mensuels</h2>
            <div className="flex items-end gap-2" style={{ height: 180 }}>
              {[45, 52, 58, 61, 67, 72, 78, 82, 85, 89, 92, 95].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  className="flex-1 rounded-t-lg bg-brand-800"
                  title={`${value}M FCFA`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-gray-500">
              {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Activité récente</h2>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div className="divide-y divide-gray-800">
              {recentActivity.map((activity, i) => {
                const config = activityIcons[activity.type];
                const IconComp = config.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-6 py-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                      <IconComp className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-300">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-xs font-medium text-brand-600">
                        +{formatCFA(activity.amount)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
