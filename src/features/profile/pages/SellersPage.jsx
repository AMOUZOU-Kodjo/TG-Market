import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Star, MapPin, Package, ShieldCheck } from "lucide-react";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Avatar from "@/shared/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function SellersPage() {
  const navigate = useNavigate();
  const { siteName } = useSiteSettings();

  const { data: sellersRaw = [], isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });
  const sellers = (sellersRaw?.data || sellersRaw || []).filter(
    (u) => u.verified
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/", icon: Home },
          { label: "Vendeurs vérifiés" },
        ]}
      />

      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Vendeurs vérifiés
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Nos vendeurs de confiance, vérifiés par {siteName}.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sellers.map((seller, i) => (
          <motion.div
            key={seller.id}
            variants={fadeUp}
            custom={i}
            onClick={() => navigate(`/vendeur/${seller.id}`)}
            className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex items-start gap-4">
              <Avatar src={seller.avatar} name={seller.name} size="lg" online />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {seller.name}
                  </h3>
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{seller.district ? `${seller.district}, ` : ""}{seller.city}</span>
                </div>
                {seller.bio && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {seller.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{seller.rating}</span>
                <span className="text-gray-400">({seller.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Package className="h-3.5 w-3.5" />
                <span>{seller.productCount} annonces</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
