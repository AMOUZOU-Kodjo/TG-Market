import { useNavigate } from "react-router-dom";
import { Package, Megaphone } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import { useMyProducts } from "@/features/products/hooks/useProducts";

export default function PromotionsTab() {
  const navigate = useNavigate();
  const { data: myProductsData } = useMyProducts();
  const products = myProductsData?.data ?? [];
  const promotedProducts = products.filter((p) => p.isPromoted || p.isFeatured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Promotions</h3>
        <button
          onClick={() => navigate("/vendre")}
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors"
        >
          <Package className="h-4 w-4" />
          Nouvelle annonce
        </button>
      </div>

      {promotedProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {promotedProducts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-amber-100 bg-white p-4 dark:border-amber-900/30 dark:bg-gray-800">
              <div className="flex items-start gap-3">
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.title} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{p.title}</p>
                  <p className="text-sm font-semibold text-brand-800">{formatCFA(p.price)}</p>
                  <div className="mt-1 flex gap-1.5">
                    {p.isPromoted && <Badge variant="warning">Promu</Badge>}
                    {p.isFeatured && <Badge variant="primary">Featured</Badge>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <Megaphone className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
          <h4 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Aucune annonce promue</h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Mettez en avant vos annonces pour toucher plus d'acheteurs.
          </p>
          <button
            onClick={() => navigate("/vendre")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-800 px-5 py-2 text-sm font-medium text-white hover:bg-brand-900 transition-colors"
          >
            <Megaphone className="h-4 w-4" />
            Publier une annonce
          </button>
        </div>
      )}
    </div>
  );
}