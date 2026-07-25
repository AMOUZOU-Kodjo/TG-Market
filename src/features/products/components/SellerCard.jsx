import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Package,
  MessageCircle,
  Star,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import { formatRelativeTime } from "@/shared/utils/format";

export default function SellerCard({ seller }) {
  if (!seller) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={seller.avatar}
          name={seller.name}
          size="lg"
          verified={seller.verified}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {seller.name}
            </h3>
            {seller.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-900 dark:bg-red-700/15 dark:text-red-400">
                <ShieldCheck className="h-3 w-3" />
                Vérifié
              </span>
            )}
          </div>

          {seller.rating && (
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(seller.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {seller.rating}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({seller.reviewCount} avis)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {seller.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">
              {seller.city}
              {seller.district ? `, ${seller.district}` : ""}
            </span>
          </div>
        )}
        {seller.joinedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">
              Membre {formatRelativeTime(seller.joinedAt)}
            </span>
          </div>
        )}
        {seller.productCount != null && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Package className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{seller.productCount} annonces</span>
          </div>
        )}
        {seller.reviewCount != null && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{seller.reviewCount} avis</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <Link to={`/vendeur/${seller.id}`} className="flex-1">
          <Button
            variant="outline"
            fullWidth
            size="md"
            icon={ExternalLink}
          >
            Voir profil
          </Button>
        </Link>
        <Button
          variant="primary"
          fullWidth
          size="md"
          icon={MessageCircle}
          onClick={() => {
            window.location.href = `/messages?seller=${seller.id}`;
          }}
        >
          Contacter
        </Button>
      </div>
    </motion.div>
  );
}
