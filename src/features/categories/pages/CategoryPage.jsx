import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Package } from "lucide-react";
import { useCategory, useCategoryProducts } from "@/features/categories/hooks/useCategories";
import ProductCard from "@/shared/ui/ProductCard";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import EmptyState from "@/shared/ui/EmptyState";

export default function CategoryPage() {
  const { slug } = useParams();

  const { data: category, isLoading } = useCategory(slug);
  const { data: productsData } = useCategoryProducts(slug, { page: 1, perPage: 20 });

  const categoryName = category?.name || slug;
  const products = productsData?.data || productsData || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!category) {
    return <Navigate to="/404" replace />;
  }

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Catégories", href: "/categories" },
    { label: categoryName },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {categoryName}
          </h1>
          {category?.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {products.length} annonce{products.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucune annonce"
            description={`Aucune annonce n'est disponible dans cette catégorie pour le moment.`}
            action={
              <Link
                to="/vendre"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-800"
              >
                Publier une annonce
              </Link>
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                location={`${product.city}${product.district ? `, ${product.district}` : ""}`}
                condition={product.condition}
                hasActiveNegotiation={product.hasActiveNegotiation}
                onClick={() =>
                  (window.location.href = `/annonce/${product.id}`)
                }
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
