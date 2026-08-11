import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Package,
  MessageCircle,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import SellerBadges from "@/shared/ui/SellerBadges";
import { formatRelativeTime } from "@/shared/utils/format";
import { useCreateConversation } from "@/features/chat/hooks/useConversations";
import { useAuth } from "@/shared/contexts/AuthContext";

export default function SellerCard({ seller, productId, hasActiveEscrow, productStatus }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwn = user?.id === seller?.id;
  const { mutateAsync: createConversation, isPending } = useCreateConversation();

  if (!seller) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl    p-5  dark:border-gray-800 dark:bg-gray-800"
    >
      <div className="flex  items-start gap-4">
        <Avatar src={seller.avatar} name={seller.name} size="lg" verified={seller.verified} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {seller.name}
            </h3>
            <button
              onClick={() => navigate(`/vendeur/${seller.id}`)}
              className="lg:hidden rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              title="Voir le profil"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <SellerBadges seller={seller} className="mt-1" />

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
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {seller.joinedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">Membre {formatRelativeTime(seller.joinedAt)}</span>
          </div>
        )}
        {seller.productCount != null && (
          <button
            onClick={() => navigate(`/vendeur/${seller.id}`)}
            className="flex items-center gap-2 text-left text-sm text-gray-600 transition-colors hover:text-brand-700 dark:text-gray-400 dark:hover:text-brand-400 cursor-pointer"
          >
            <Package className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="underline underline-offset-4 decoration-2 decoration-brand-500">
              {seller.productCount} article{seller.productCount > 1 ? "s" : ""}
            </span>
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={`/vendeur/${seller.id}`} className="hidden sm:block flex-1 min-w-[130px]">
          <Button variant="outline" fullWidth size="md" icon={ExternalLink}>
            Voir profil
          </Button>
        </Link>
        {!isOwn ? (
          <>
            {productStatus === "sold" ? (
              <div className="w-full rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Vendu
              </div>
            ) : productStatus === "reserved" ? (
              <div className="w-full rounded-xl bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                Réservé
              </div>
            ) : hasActiveEscrow ? (
              <div className="w-full rounded-xl bg-orange-50 px-4 py-3 text-center text-sm font-semibold text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                Déjà commandé
              </div>
            ) : null}
            <div className="flex-1 min-w-[130px]">
              <Button
                variant="outline"
                fullWidth
                size="md"
                icon={MessageCircle}
                loading={isPending}
                onClick={async () => {
                  try {
                    const conv = await createConversation({
                      participantId: seller.id,
                      productId,
                    });
                    navigate(`/messages/${conv.id}`);
                  } catch {
                    // silently ignore — user can retry
                  }
                }}
              >
                Contacter
              </Button>
            </div>
          </>
        ) : (
          <Link to="/dashboard" className="w-full">
            <Button variant="outline" fullWidth size="md" icon={ExternalLink}>
              Gérer mon annonce
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
