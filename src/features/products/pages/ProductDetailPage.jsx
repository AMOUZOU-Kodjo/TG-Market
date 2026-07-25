import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Truck,
  Eye,
  Heart,
  Tag,
  Clock,
  ChevronRight,
  Home,
  Package,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { mockReviews } from "@/data/reviews";
import { formatCFA, formatRelativeTime, formatNumber } from "@/shared/utils/format";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Badge from "@/shared/ui/Badge";
import ImageGallery from "@/shared/ui/ImageGallery";
import ProductActions from "@/features/products/components/ProductActions";
import SellerCard from "@/features/products/components/SellerCard";
import SimilarProducts from "@/features/products/components/SimilarProducts";
import ProductReviews from "@/features/products/components/ProductReviews";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => mockProducts.find((p) => String(p.id) === String(id)),
    [id]
  );

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.subcategory === product.subcategory)
      )
      .slice(0, 8);
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-red-700" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Produit introuvable
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Ce produit n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-900"
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const categorySlug = mockCategories.find(
    (c) => c.name.toLowerCase() === product.category?.toLowerCase()
  )?.slug;

  const breadcrumbItems = [
    { label: "Accueil", href: "/", icon: Home },
    ...(categorySlug
      ? [{ label: product.category, href: `/categories/${categorySlug}` }]
      : []),
    { label: product.title },
  ];

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-5" />

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
              <ImageGallery images={product.images} />
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h1 className="mb-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                {product.title}
              </h1>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    product.condition === "Neuf"
                      ? "success"
                      : product.condition === "Comme neuf"
                        ? "primary"
                        : "warning"
                  }
                >
                  {product.condition}
                </Badge>
                {product.negotiable && (
                  <Badge variant="neutral">Négociable</Badge>
                )}
                {product.deliveryAvailable && (
                  <Badge variant="secondary">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Livraison disponible
                    </span>
                  </Badge>
                )}
              </div>

              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand-800">
                  {formatCFA(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through dark:text-gray-600">
                      {formatCFA(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-700/15 dark:text-brand-600">
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>

              <div className="mb-5 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {formatNumber(product.views)} vues
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  {formatNumber(product.favorites)} favoris
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatRelativeTime(product.createdAt)}
                </span>
              </div>

              <div className="mb-5 flex items-start gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {product.neighborhood ? `${product.neighborhood}, ` : ""}
                  {product.city}, Togo
                </span>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>

              <ProductActions product={product} />
            </motion.div>

            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <motion.div
                  {...fadeUp}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                    <Package className="h-5 w-5 text-brand-800" />
                    Caractéristiques
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between rounded-xl bg-gray-50 px-4 py-2.5 dark:bg-gray-800"
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {key}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

            {product.tags && product.tags.length > 0 && (
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-800/30 dark:hover:text-brand-700"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          <div className="space-y-5">
            <div className="lg:sticky lg:top-24">
              <SellerCard seller={product.seller} />

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.25 }}
                className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Publié
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatRelativeTime(product.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Vues
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(product.views)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Favoris
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(product.favorites)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Catégorie
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12">
            <SimilarProducts products={similarProducts} />
          </div>
        )}

        <div className="mt-12">
          <ProductReviews productId={product.id} reviews={mockReviews} />
        </div>
      </div>
    </div>
  );
}
