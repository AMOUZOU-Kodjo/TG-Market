import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { FaBoxOpen } from "react-icons/fa6";
import {
  MapPin,
  Truck,
  Eye,
  Heart,
  Tag,
  Clock,
  Home,
  Package,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  MessageSquare,
  ShoppingCart,
  ChevronLeft,
} from "lucide-react";
import { useProduct, useSimilarProducts } from "@/features/products/hooks/useProducts";
import { productsApi } from "@/features/products/services/products.api";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA, formatRelativeTime, formatNumber } from "@/shared/utils/format";
import BackButton from "@/shared/ui/BackButton";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
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

  const { data: product, isLoading } = useProduct(id);
  const { data: similarProducts = [] } = useSimilarProducts(id);
  const { data: categories = [] } = useCategories();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      productsApi.incrementViews(id).catch(() => {});
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

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

  const categorySlug = product.category?.slug;

  const breadcrumbItems = [
    { label: "Accueil", href: "/", icon: Home },
    ...(categorySlug
      ? [{ label: product.category.name, href: `/categories/${categorySlug}` }]
      : []),
    { label: product.title },
  ];

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="sticky top-28 z-40 -mx-4 mt-[-1rem] bg-white px-4 py-3 backdrop-blur-sm dark:bg-gray-950/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 min-w-0 sm:gap-10">
              <BackButton />
              <h1 className="flex-1 min-w-0 truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base sm:truncate-none">
                {product.title}
              </h1>
            </div>
            <div className="flex shrink-0 gap-1.5 justify-center sm:justify-start">
              <Link to={`/offre/${product.id}`}>
                <Button variant="primary" size="sm" icon={MessageSquare}>
                  <span className="hidden sm:inline">Faire une offre</span>
                  <span className="sm:hidden">Offre</span>
                </Button>
              </Link>
              <Link to="/lot/creer">
                <Button variant="outline" size="sm" icon={Package}>
                  <span className="hidden sm:inline">Créer un lot</span>
                  <span className="sm:hidden">Lot</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* <Breadcrumb items={breadcrumbItems} className="mb-5 mt-3" /> */}

        {/* <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_380px]"> */}
        <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_720px]">
          <div className="space-y-6 min-w-0">
            <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
              {/* <div className="overflow-hidden rounded-2xl aspect-[16/] max-h-[780px]"> */}
              <div className="overflow-hidden rounded-2xl aspect-[10/9]   max-h-120">
                {/* <div className="overflow-hidden rounded-2xl aspect-[16/9] max-h-[360px]"> */}
                <ImageGallery images={product.images} />
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="rounded-2xl  p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800"
            >
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
                {product.negotiable && <Badge variant="neutral">Négociable</Badge>}
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

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                  <Package className="h-5 w-5 text-brand-800" />
                  Caractéristiques
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between rounded-xl bg-gray-50 px-4 py-2.5 dark:bg-gray-800"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">{key}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {product.tags && product.tags.length > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2">
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

          <div className="space-y-5 ">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-100 bg-white  shadow-sm ">
              <SellerCard seller={product.seller} productId={product.id} />

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.25 }}
                className="mt-5   p-4  dark:border-gray-800 dark:bg-gray-800"
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
                      {product.category?.name || product.category}
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

        <div className="mt-5">
          <ProductReviews productId={product.id} sellerId={product.seller?.id} />
        </div>
      </div>
    </div>
  );
}
