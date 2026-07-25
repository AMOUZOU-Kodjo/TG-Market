import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";

const mockSellerProducts = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra 256GB",
    price: 850000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop",
    status: "active",
    views: 234,
    favorites: 45,
    createdAt: "2025-07-10T08:00:00Z",
  },
  {
    id: 5,
    title: "PS5 + 2 Manettes + 3 Jeux",
    price: 380000,
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=100&h=100&fit=crop",
    status: "active",
    views: 445,
    favorites: 67,
    createdAt: "2025-07-01T16:45:00Z",
  },
  {
    id: 12,
    title: "Canon EOS R6 Mark II",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
    status: "active",
    views: 423,
    favorites: 61,
    createdAt: "2025-06-12T16:00:00Z",
  },
  {
    id: 14,
    title: "DJI Mini 4 Pro - Drone",
    price: 650000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop",
    status: "paused",
    views: 345,
    favorites: 48,
    createdAt: "2025-06-08T10:15:00Z",
  },
  {
    id: 20,
    title: "MacBook Air M2",
    price: 650000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop",
    status: "sold",
    views: 312,
    favorites: 56,
    createdAt: "2025-07-03T09:15:00Z",
  },
];

const statusConfig = {
  active: { label: "En ligne", variant: "success" },
  paused: { label: "En pause", variant: "warning" },
  sold: { label: "Vendu", variant: "secondary" },
  draft: { label: "Brouillon", variant: "neutral" },
};

export default function ProductTable({ products = mockSellerProducts, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [visibilityMap, setVisibilityMap] = useState(() =>
    Object.fromEntries(products.map((p) => [p.id, p.status === "active"]))
  );

  const toggleVisibility = (id) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Produit
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                Prix
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                Statut
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                Vues
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                Favoris
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {products.map((product) => (
              <motion.tr
                key={product.id}
                layout
                className="group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 sm:hidden">
                        {formatCFA(product.price)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 md:hidden">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          statusConfig[product.status]?.variant === "success" && "bg-brand-100 text-brand-700",
                          statusConfig[product.status]?.variant === "warning" && "bg-yellow-50 text-yellow-600",
                          statusConfig[product.status]?.variant === "secondary" && "bg-gray-100 text-gray-700"
                        )}>
                          {statusConfig[product.status]?.label}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                  {formatCFA(product.price)}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge variant={statusConfig[product.status]?.variant || "neutral"}>
                    {statusConfig[product.status]?.label}
                  </Badge>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 lg:table-cell">
                  {product.views}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 lg:table-cell">
                  {product.favorites}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleVisibility(product.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      title={visibilityMap[product.id] ? "Masquer" : "Afficher"}
                    >
                      {visibilityMap[product.id] ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onEdit?.(product)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-800 dark:hover:bg-gray-800 dark:hover:text-red-400"
                      title="Modifier"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(product)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
